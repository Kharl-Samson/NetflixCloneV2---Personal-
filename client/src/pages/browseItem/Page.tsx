import { useLocation, useParams } from "react-router-dom"
import { getCasts, getShowDetails, getShowTrailer } from "../../services/apiFetchShowList"
import { useQuery } from "react-query"
import { useEffect, useState } from "react"
import { dataInEffect } from "../../utils/itemsFunction"
import { VideoSection } from "./components/VideoSection"
import logo from "../../assets/images/icons/logo.png"
import { convertToHoursAndMinutes } from "../../utils/getCurrentSection"

export const Page = () => {
    // Params key when clicking a movie or tv show
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const params = queryParams.get('q') || "Default"

    // Params ID in Route
    const { category } = useParams()
    const categotyParams = category || ""
    
    // Fetch show data 
    const { data : showDetailsData, isFetched: isFetchedShowDetails , isLoading: isShowDetailsLoading } = useQuery(
      ["showDetailsPhoneKey", params],
      () => getShowDetails(categotyParams, params, "en-US"),
      { cacheTime: 0 } // Remove caching to trigger every click
    )
  
    // Fetch trailer data
    const { data : myTrailerData, isFetched: isFetchedTrailer, isError: isTrailerError , isLoading: isTrailerLoading } = useQuery(
      ["trailerModalKey", params],
      () => getShowTrailer(categotyParams, params),
      { cacheTime: 0 } // Remove caching to trigger every click
    )

    // Fetch Casts
    const { data : castsData, isFetched: isFetchedCasts, isLoading: isCastsLoading } = useQuery(
      ["castKey", params],
      () => getCasts(categotyParams, params),
      { cacheTime: 0 } // Remove caching to trigger every click
    )

    // When done querying put the data in states variable
    useEffect(() => {
      // Trailer Data Query
      (isFetchedTrailer && !isTrailerError && myTrailerData?.results.length !== 0) && dataInEffect(myTrailerData)
    }, [isFetchedTrailer, myTrailerData, isFetchedCasts, castsData, isFetchedShowDetails, showDetailsData])

    // Random Array - [Match and Age]
    const matchArray : string[] = ["95", "96","97", "98"]
    const ageArray : string[] = ["10", "13", "16"]
    const [match, setMatch] = useState<string>("")
    const [age, setAge] = useState<string>("")
    useEffect(() => {
      const randomMatch = Math.floor(Math.random() * matchArray.length)
      const randomAge = Math.floor(Math.random() * ageArray.length)
      setMatch(matchArray[randomMatch])
      setAge(ageArray[randomAge])
    },[])

    // Get Show runtime length if the category is movie
    const showRuntime = !showDetailsData?.number_of_seasons ? convertToHoursAndMinutes(showDetailsData?.runtime || 0) : null
    const { hours, minutes } = showRuntime || { hours: 0, minutes: 0 }

    console.log(isCastsLoading, isShowDetailsLoading, isTrailerLoading)
    console.log(showDetailsData)

  return (
    <section>
      {/* Video Player */}
      <VideoSection
        isFetchedTrailer = {isFetchedTrailer}
        showDetailsData = {showDetailsData}
      />

      {/* Details */}
      <div className="mx-2 mt-2">
        {/* If the item is produce by Netflix */
        showDetailsData && showDetailsData.networks && showDetailsData.networks.some((network: {name : string}) => network.name === "Netflix") && 
          <div className="flex items-center gap-x-1">
            <img src={logo} alt="Netflix logo" className="h-4"/>
            <p className="text-xs text-[#cecece] tracking-[0.3rem] font-bold mt-[2px]">SERIES</p>
          </div>
        }

        {/* Title */}
        <p className="text-white text-lg font-bold tracking-wide">{showDetailsData?.name || showDetailsData?.original_title}</p>

        {/* Match, Year, Age and Season or Episode count or Runtime */}
        <div className="mt-1 flex items-center flex-wrap gap-1">
          {/* Match Percentage */}
          <p className="text-[#42c161] text-sm">{match}% Match</p>

          {/* Release Date */}
          <p className="text-[#bcbcbc] text-sm ml-1">
            {new Date(showDetailsData?.release_date || showDetailsData?.last_air_date || showDetailsData?.first_air_date || "2024-01-25").getFullYear()}
          </p>

          {/* Age */}
          <div className="text-[#bcbcbc] float-left text-xs px-[5px] bg-[#464646] rounded-[2px]">{age}+</div>

          {/* Season Count or Episode Count or Movie length*/}
          <p className="text-[#bcbcbc] text-sm">
            {
              !showDetailsData?.number_of_seasons ? // If movie -> Show the movie length
                `${hours}h ${minutes}m`
              :
              showDetailsData?.number_of_seasons === 1 ? // If season but only 1 -> Show total episodes
                `${showDetailsData?.number_of_episodes} Episodes` || "No data available"
              : // If seasons but its more than 1 -> Show total seasons
                `${showDetailsData?.number_of_seasons} Seasons` || "No data available"
            }
          </p>

          {/* HD */}
          <div className="text-[#9b9b9b] rounded text-xs py-[1px] px-[4px] border border-[#9b9b9b] disable-highlight">HD</div>
        </div>
      </div>
    </section>
  )
}
