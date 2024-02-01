import { useAppStore } from "../../../store/ZustandStore"
import { handleImageError } from "../../../types/errorTypes"
import { YoutubePlayerModal } from "../../../widgets/youtubePlayer/YoutubePlayerModal"
import { useQuery } from "react-query"
import { getCasts, getShowDetails, getShowTrailer } from "../../../services/apiFetchShowList"
import { RefObject, useEffect, useState } from "react"
import { dataInEffect, useClickHandlers, useRouteAndQueryParams } from "../../../utils/itemsFunction"
import CircularProgress from "@mui/material/CircularProgress"
import { BannerData } from "./components/BannerData"
import { ShowDescription } from "./components/ShowDescription"
import { EpisodeLists } from "./components/EpisodeLists"
import { getCurrentArticle } from "../../../utils/getCurrentSection"

type showDetailsDataProps = {
  scrollToBottom: () => void
  myRef: RefObject<HTMLDivElement>
}

export const ShowsDetails = ({scrollToBottom, myRef} : showDetailsDataProps) => {
    const body = document.body
    body.style.overflowY = "hidden"

    // Params Url Getter
    const { params, categoryParams } = useRouteAndQueryParams()
  
    // Getting Active Section
    const activeSections = getCurrentArticle(myRef)
    const { currentArticle, setCurrentArticle, setShowVideoModal } = useAppStore()
    useEffect(() => {
      setCurrentArticle(activeSections)
    }, [activeSections])

    // Render Hero Video Component if the user is in hero section
    const [firstLoadStatus, setFirstLoadStatus] = useState<boolean>(true)
    useEffect(() => {
        if((params && (categoryParams === "tv" || categoryParams === "movie")) && currentArticle === "detailsSection") {
            setShowVideoModal(false)
            setFirstLoadStatus(false)
        }     
        ((params && (categoryParams === "tv" || categoryParams === "movie")) && currentArticle !== "detailsSection" && !firstLoadStatus) && setShowVideoModal(true)
    }, [currentArticle])
    

    // React Youtube State
    const { showVideoModal, trailerData } = useAppStore()

    // Fetch show data 
    const { data : showDetailsData, isFetched: isFetchedShowDetails, isLoading: isShowDetailsLoading } = useQuery(
      ["showDetailsDesktopKey", params],
      () => getShowDetails(categoryParams, params, "en-US"),
      { cacheTime: 0 } // Remove caching to trigger every click
    )

    // Fetch trailer data
    const { data : myTrailerData, isFetched: isFetchedTrailer, isError: isTrailerError , isLoading: isTrailerLoading } = useQuery(
      ["trailerModalKey", params],
      () => getShowTrailer(categoryParams, params),
      { cacheTime: 0 } // Remove caching to trigger every click
    )

    // Fetch Casts
    const { data : castsData, isFetched: isFetchedCasts, isLoading: isCastsLoading } = useQuery(
      ["castKey", params],
      () => getCasts(categoryParams, params),
      { cacheTime: 0 } // Remove caching to trigger every click
    )

    // When done querying put the data in states variable
    useEffect(() => {
      // Trailer Data Query
      (isFetchedTrailer && !isTrailerError && myTrailerData?.results.length !== 0) && dataInEffect(myTrailerData)
    }, [isFetchedTrailer, myTrailerData, isFetchedCasts, castsData])

    // Setting Web Title
    useEffect(() => {
      if (isFetchedShowDetails && !isShowDetailsLoading) {
        document.title = `${showDetailsData.title || showDetailsData.name || showDetailsData.original_title} - Netflix Clone by Kharl`
      }
    },[showDetailsData])

    // Closing Modal
    const { handleCloseModalOut } = useClickHandlers()

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

  return (
  (isTrailerLoading && isCastsLoading && isShowDetailsLoading)  ? 
    <div className="h-[100dvh] w-full flex items-center justify-center">
     <CircularProgress sx={{color:"red"}}/>
    </div>
    :
    <div className="min-h-[100dvh] w-[95%] 801size:w-[80%] max-w-[55rem] bg-[#181818] mx-auto mt-9 rounded-lg overflow-hidden pb-[2.5rem]">
        {/* Image Banner */}
        <img 
            src={`${showDetailsData?.backdrop_path && import.meta.env.VITE_BASE_IMAGE_URL}${showDetailsData?.backdrop_path}`}
            alt="Movie Image"
            className={`custom-transition-duration-10s w-full h-[31rem] z-[1] relative object-cover 1051size:object-contain ${showVideoModal ? "opacity-0" : "opacity-100"}`}
            onError={handleImageError}
        />

        {/* Video Player */}
        <div className={`custom-transition-duration-10s max-w-[3000px] mx-auto top-0 w-full h-[31rem] overflow-hidden mt-[-31rem] z-[2] relative ${showVideoModal ? "opacity-100" : "opacity-0"}`} key={trailerData}>
            <YoutubePlayerModal
                key={trailerData}
                id = "youtubePlayerModal"
                videoId = {trailerData} 
                duration = {2500}
                isFetchedTrailer = {isFetchedTrailer}
            />
        </div>

        {/* Shadow Effects Cover */}
        <div className="z-[3] hidden sm:flex mt-[-31rem]
            justify-end w-full h-[31rem] relative"
            style = {{background: "linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%)"}}
        > 
            <div className="bg-[#181818] h-[2.3rem] w-[2.3rem] mt-5 mr-5 rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-90"
              onClick={() =>  handleCloseModalOut()}
            >
                <p className="text-4xl mt-[-2px]">&#215;</p>
            </div>
        </div>

        {/* Shadowing */}
        <div className="hidden sm:block z-[4] shadowing-hero-modal"></div>

        {/* Banner Title and Buttons */}
        <BannerData showDetailsData = {showDetailsData}/>

        {/* Details */}
        <ShowDescription 
          castsData = {castsData}
          showDetailsData = {showDetailsData}
          match = {match}
          age = {age}
          scrollToBottom = {scrollToBottom}
        />

        <article id="detailsSection">
          {/* Episodes - [If it is TV Show] */}
          <EpisodeLists
            castsData = {castsData}
            showDetailsData = {showDetailsData}
            age = {age}
          />
        </article>
    </div>
  )
}
