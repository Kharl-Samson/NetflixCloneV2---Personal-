import { useAppStore } from "../../store/ZustandStore"
import { handleImageError } from "../../types/errorTypes"
import { YoutubePlayerModal } from "../../widgets/youtubePlayer/YoutubePlayerModal"
import play from "../../assets/images/icons/play.png"
import add from "../../assets/images/icons/add.png"
import { styled } from "@mui/material/styles"
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import { useQuery } from "react-query"
import { getCasts, getShowTrailer } from "../../services/apiFetchShowList"
import { useEffect, useState } from "react"
import { dataInEffect, toggleVideoSoundModal, useClickHandlers } from "../../utils/itemsFunction"
import CircularProgress from "@mui/material/CircularProgress"
import { convertToHoursAndMinutes } from "../../utils/getCurrentSection"

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "#1e1e1e",
      boxShadow: theme.shadows[1],
      fontSize: 20,
      fontWeight: "bold",
      padding: ".5rem 1.50rem"
    },
}))

type ShowDetailsProps = {
  params : string
}

export const ShowsDetails = ({params} : ShowDetailsProps) => {
    // React Youtube State
    const { showVideoModal, isMutedModal, videoEndedModal, trailerData, category, showDetails } = useAppStore()

    // Fetch trailer data
    const { data : myTrailerData, isFetched: isFetchedTrailer, isError: isTrailerError , isLoading: isTrailerLoading } = useQuery(
      ["trailerModalKey"],
      () => getShowTrailer(category, params),
      { cacheTime: 0 } // Remove caching to trigger every click
    )

    // Fetch Casts
    const { data : castsData, isFetched: isFetchedCasts } = useQuery(
      ["castKey"],
      () => getCasts(category, showDetails?.id),
      { cacheTime: 0 } // Remove caching to trigger every click
    )
    
    // When done querying put the data in states variable
    useEffect(() => {
      // Trailer Data Query
      (isFetchedTrailer && !isTrailerError && myTrailerData?.results.length !== 0) && dataInEffect(myTrailerData)
    }, [isFetchedTrailer, myTrailerData, isFetchedCasts, castsData])

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

     // Get Show runtime length if the category is movie
    const showRuntime = !showDetails?.number_of_seasons ? convertToHoursAndMinutes(showDetails?.runtime || 0) : null
    const { hours, minutes } = showRuntime || { hours: 0, minutes: 0 }

  return (
    isTrailerLoading ? 
    <div className="h-screen w-full flex items-center justify-center">
     <CircularProgress sx={{color:"red"}}/>
    </div>
    :
    <div className="min-h-screen w-[95%] 801size:w-[80%] max-w-[55rem] bg-[#181818] mx-auto mt-9 rounded-lg overflow-hidden">
        {/* Image Banner */}
        <img 
            src={`${showDetails?.backdrop_path && import.meta.env.VITE_BASE_IMAGE_URL}${showDetails?.backdrop_path}`}
            alt="Movie Image"
            className={`custom-transition-duration-10s w-full h-[31rem] z-[1] relative object-cover ${showVideoModal ? "opacity-0" : "opacity-100"}`}
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
        <div className="relative z-[5] mt-[-17.5rem] px-14">
            <p 
                className={`text-white custom-transition-duration-10s
                    movie-title-font-large max-w-[40rem] xl:max-w-[80%] 
                    leading-tight text-4xl capitalize`}
            >
                {showDetails?.name || showDetails?.original_title}
            </p>
   
            <div className="mt-8 flex justify-between gap-x-[15px] disable-highlight">
                {/* Play and Add */}
                <div className="flex items-center gap-x-[15px]">
                    <button className="rounded flex items-center gap-x-[15px] py-[5px] px-[45px] transition duration-400 bg-white hover:opacity-80">
                      <img src={play} alt="Play Icon" className="h-[25px]"/>
                      <span className="text-[1.3em] font-semibold">Play</span>
                    </button>

                    {/* Add to Mylist */}
                    <LightTooltip title="Add to My List" arrow sx={{'& .MuiTooltip-arrow': {color: '#ffff',},}}>
                      <div className="bg-[#232323] rounded-full h-11 w-11 flex items-center justify-center border-2 border-[#8b8b8b] cursor-pointer">
                        <img src={add} alt="Play Icon" className="h-5"/>
                      </div>
                    </LightTooltip>
                </div>

                {/* Video Sound Controller */}
                <div 
                  className={`h-[42px] w-[42px] border-[2px] border-solid border-[#767576] text-[#767576] rounded-full 
                    items-center cursor-pointer justify-center transition duration-400 hover:bg-gray-600 hover:bg-opacity-35 flex 
                    hover:cursor-pointer ${(showVideoModal || videoEndedModal) ? "flex" : "hidden"}`} 
                    onClick={toggleVideoSoundModal}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`Hawkins-Icon Hawkins-Icon-Standard ${showVideoModal && isMutedModal && !videoEndedModal ? "block" : "hidden"}`}><path d="M11 4.00003C11 3.59557 10.7564 3.23093 10.3827 3.07615C10.009 2.92137 9.57889 3.00692 9.29289 3.29292L4.58579 8.00003H1C0.447715 8.00003 0 8.44774 0 9.00003V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00003ZM5.70711 9.70714L9 6.41424V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70714ZM15.2929 9.70714L17.5858 12L15.2929 14.2929L16.7071 15.7071L19 13.4142L21.2929 15.7071L22.7071 14.2929L20.4142 12L22.7071 9.70714L21.2929 8.29292L19 10.5858L16.7071 8.29292L15.2929 9.70714Z" fill="currentColor"></path></svg>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`Hawkins-Icon Hawkins-Icon-Standard ${showVideoModal && !isMutedModal && !videoEndedModal ? "block" : "hidden"}`}><path d="M24 12C24 8.28699 22.525 4.72603 19.8995 2.10052L18.4853 3.51474C20.7357 5.76517 22 8.81742 22 12C22 15.1826 20.7357 18.2349 18.4853 20.4853L19.8995 21.8995C22.525 19.274 24 15.7131 24 12ZM11 4.00001C11 3.59555 10.7564 3.23092 10.3827 3.07613C10.009 2.92135 9.57889 3.00691 9.29289 3.29291L4.58579 8.00001H1C0.447715 8.00001 0 8.44773 0 9.00001V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00001ZM5.70711 9.70712L9 6.41423V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70712ZM16.0001 12C16.0001 10.4087 15.368 8.8826 14.2428 7.75739L12.8285 9.1716C13.5787 9.92174 14.0001 10.9392 14.0001 12C14.0001 13.0609 13.5787 14.0783 12.8285 14.8285L14.2428 16.2427C15.368 15.1174 16.0001 13.5913 16.0001 12ZM17.0709 4.92896C18.9462 6.80432 19.9998 9.34786 19.9998 12C19.9998 14.6522 18.9462 17.1957 17.0709 19.0711L15.6567 17.6569C17.157 16.1566 17.9998 14.1218 17.9998 12C17.9998 9.87829 17.157 7.84346 15.6567 6.34317L17.0709 4.92896Z" fill="currentColor"></path></svg>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`Hawkins-Icon Hawkins-Icon-Standard ${videoEndedModal ? "block" : "hidden"}`}><path d="M13.1747 3.07702C11.01 2.79202 8.81537 3.30372 6.99988 4.51679C5.18439 5.72987 3.8718 7.56158 3.30668 9.67065C2.74155 11.7797 2.96243 14.0223 3.92815 15.9806C4.89388 17.9389 6.53859 19.4794 8.55586 20.3149C10.5731 21.1505 12.8254 21.2242 14.893 20.5224C16.9606 19.8205 18.7025 18.391 19.7942 16.5L18.0622 15.5C17.2131 16.9708 15.8582 18.0826 14.2501 18.6285C12.642 19.1744 10.8902 19.1171 9.32123 18.4672C7.75224 17.8173 6.47302 16.6192 5.7219 15.096C4.97078 13.5729 4.79899 11.8287 5.23853 10.1883C5.67807 8.5479 6.69897 7.12324 8.11102 6.17973C9.52307 5.23623 11.23 4.83824 12.9137 5.05991C14.5974 5.28158 16.1432 6.10778 17.2629 7.3846C18.1815 8.43203 18.762 9.7241 18.9409 11.0921L17.5547 10.168L16.4453 11.8321L19.4453 13.8321C19.7812 14.056 20.2188 14.056 20.5547 13.8321L23.5547 11.8321L22.4453 10.168L20.9605 11.1578C20.784 9.27909 20.0201 7.49532 18.7666 6.06591C17.3269 4.42429 15.3395 3.36202 13.1747 3.07702Z" fill="currentColor"></path></svg>
                </div>
            </div>
        </div>


        <div className="px-14 mt-[4.5rem] relative z-10 flex gap-x-12 justify-between">
          {/* Description */}
          <div className="grow">
            <div className="flex items-center gap-x-2">
              {/* Match Percentage */}
              <p className="text-[#42c161] font-medium disable-highlight">{match}% Match</p>

              {/* Release Date */}
              <p className="text-[#9b9b9b] font-medium disable-highlight">{ new Date(showDetails?.release_date || showDetails?.last_air_date).getFullYear() }</p>

              {/* Season Count or Episode Count or Movie length*/}
              <p className="text-[#9b9b9b] font-medium disable-highlight">
                {
                  !showDetails?.number_of_seasons ? // If movie -> Show the movie length
                    `${hours}h ${minutes}m`
                  :
                  showDetails?.number_of_seasons === 1 ? // If season but only 1 -> Show total episodes
                    `${showDetails?.number_of_episodes} Episodes` || "No data available"
                  : // If seasons but its more than 1 -> Show total seasons
                    `${showDetails?.number_of_seasons} Seasons` || "No data available"
                }
              </p>

              {/* HD */}
              <div className="text-white rounded text-xs py-[1px] px-[4px] border border-[#9b9b9b] disable-highlight">HD</div>
            </div>

            {/* Age */}
            <div className="text-white float-left mt-2 text-sm py-[1px] px-[8px] border border-white">{age}+</div>

            {/* Overview */}
            <p className="mt-[4rem] text-sm font-thin text-white clear-both disable-highlight">{showDetails?.overview}</p>
          </div>

          {/* Casts, Genres and Tagline */}
          <div className="min-w-[16rem] max-w-[16rem] h-[2rem] disable-highlight">
            {/* Cast */}
            <p className="text-[#9b9b9b] text-sm">
              Cast:&nbsp;
              {/* Cast Mapping */
                castsData?.cast?.slice(0, 4).map((res: { original_name: string }) => 
                  <span className="text-sm text-white" key={res?.original_name}>{res?.original_name},&nbsp;</span>
                )
              }
              <span className="text-sm text-white italic cursor-pointer hover:underline">more</span>
            </p>
            {/* Genres */}
            <p className="text-[#9b9b9b] text-sm mt-4">
              Genres:&nbsp;
              {/* Cast Mapping */}
              {showDetails?.genres?.map((res: { name: string }, index: number, array: { name: string }[]) => 
                <span className="text-sm text-white" key={res?.name}>
                  {res?.name}{index < array.length - 1 ? ', ' : ''}
                </span>
              )}
            </p>
            {/* Taglne */}
            <p className="text-[#9b9b9b] text-sm mt-4">Tagline: <span className="text-sm text-white">{showDetails?.tagline || "Not Available"}</span></p>
          </div>
        </div>
    </div>
  )
}
