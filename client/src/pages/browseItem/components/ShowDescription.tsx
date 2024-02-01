import { useEffect, useState } from "react"
import logo from "../../../assets/images/icons/logo.png"
import play from "../../../assets/images/icons/play.png"
import add from "../../../assets/images/icons/add.png"
import { convertToHoursAndMinutes } from "../../../utils/getCurrentSection"
import { OtherInfo } from "./OtherInfo"

type ShowDescriptionProps = {
    castsData : {
      cast : {
        original_name : string
      }[]
    }
    showDetailsData : {
        title? : string
        name? : string
        original_title? : string
        overview : string
        release_date? : string
        last_air_date? : string
        first_air_date? : string
        runtime? : number
        number_of_seasons? : number
        number_of_episodes? : number
        genres : {
          name : string
        }[]
        created_by : {
          name : string
        }[]
        networks : {
            name : string
        }[]
    }
}

export const ShowDescription = ({castsData, showDetailsData} : ShowDescriptionProps ) => {

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

    // Cast, Creator, Genres, and Tagline Modal Controller
    const [isMoreModalStatus, setMoreModalStatus] = useState<boolean>(false)
    
  return (
    <div className="mx-2 mt-0">
        {/* If the item is produce by Netflix */
        showDetailsData && showDetailsData.networks && showDetailsData.networks.some((network: {name : string}) => network.name === "Netflix") && 
          <div className="flex items-center gap-x-1">
            <img src={logo} alt="Netflix logo" className="h-4"/>
            <p className="text-[.60rem] text-[#cecece] tracking-[0.3rem] font-bold mt-[2px]">SERIES</p>
          </div>
        }

        {/* Title */}
        <p className="text-white text-lg font-bold">{showDetailsData?.title || showDetailsData?.name || showDetailsData?.original_title}</p>

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
          <div className="text-[#9b9b9b] rounded text-xs py-[1px] px-[4px] border-[2px] border-[#9b9b9b] ">HD</div>
        </div>

        {/* Play button */}
        <button className="mt-3 w-full py-1 rounded flex items-center justify-center gap-x-2 bg-white text-base font-bold active:opacity-80">
            <img src={play} alt="Play Image" className="h-4"/>
            Play
        </button>

        {/* Add to my list button */}
        <button className="mt-2 w-full py-1 rounded flex items-center justify-center gap-x-2 bg-[#333333] text-base text-white font-semibold active:opacity-80">
          <img src={add} alt="Add Image" className="h-4"/>
          My List
        </button>

        {/* Overview */}
        <p className="mt-[1rem] text-sm font-thin text-[#ebebeb] clear-both ">{showDetailsData?.overview}</p>
        
        {/* Cast */}
        <p className="mt-2 text-[#9b9b9b] text-sm">
          Cast:&nbsp;
          {/* Cast Mapping */
          castsData && castsData.cast.slice(0, 3).map((res: { original_name: string }) => 
              <span className="text-sm text-[#9b9b9b]" key={res?.original_name}>{res?.original_name},&nbsp;</span>
          )}
          <span className="text-sm text-[#9b9b9b] font-bold whitespace-nowrap" onClick={() => setMoreModalStatus(true)}>... more</span>
        </p>

        {/* Creators */
        showDetailsData && showDetailsData.created_by && showDetailsData.created_by.length !== 0 &&
        <p className="text-[#9b9b9b] text-sm">
          Creators:&nbsp;
          {// Creators mapping
          showDetailsData.created_by.map((res: { name: string }, index: number) => 
              <span className="text-sm text-[#9b9b9b]" key={res?.name}>
                {res?.name}{index < showDetailsData.created_by.length - 1 && ",\u00A0\u00A0"}
              </span>
          )}
        </p>
        }

        {/* Cast, Creator, Genres, and Tagline Modal */}
        <OtherInfo
          isMoreModalStatus = {isMoreModalStatus}
          castsData = {castsData}
          showDetailsData = {showDetailsData}
          age = {age}
          onClick = {() => setMoreModalStatus(false)}
        />
    </div>
  )
}
