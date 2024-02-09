import { useQuery } from "react-query"
import { getShowList, getShowTrailer } from "../../../services/apiFetchShowList"
import CircularProgress from "@mui/material/CircularProgress"
import { useNavigate, useParams } from "react-router-dom"
import { queryTypeValues, queryTypeValuesTitle } from "../../../data/codeData"
import { styled } from "@mui/material/styles"
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import { useEffect, useRef, useState } from "react"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import { ItemType } from "../../../types/itemTypes"
import { useAppStore } from "../../../store/ZustandStore"
import { dataInEffect, useClickHandlers, useHoverHandlers } from "../../../utils/itemsFunction"
import { ItemSlider } from "../../slider/ItemSlider"

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

export const ListByGenre = () => {
    // Navigate
    const navigate = useNavigate()

    // Zustand States
    const { videoId, trailerData, showDetails, screenWidth, setPause, setShowVideo, showVideo, currentPage } = useAppStore()

    const body = document.body
    body.style.overflowY = "hidden"

    // Params Url Getter
    const { genreId } = useParams<{genreId : string}>()
		const { categoryId } = useParams<{categoryId : string}>()

    // Helper function to get the query code based on the params
    const getQueryCode = (queryType : string ) => {
      return queryTypeValues[queryType] || ""
    }

    // Fetch data to be showned in section -> First Data
    const { data : data, isLoading : isDataLoading } = useQuery(
        ["itemsByGenreKey"],
        () => getShowList(
          getQueryCode(genreId || ""),                    // Query Type (ex. Hero, Romantic Movies, TV Action & Adventure, etc)
          categoryId ? categoryId : null,                 // Category (ex. tv or movie)
          genreId === "Romantic Movies" ? null : "en-US", // Language
					genreId ? !Number.isNaN(parseInt(genreId || "")) ? parseInt(genreId) : null  : null,             // Genre
          1                                               // Page Number
        )
    )
      
    // Close modal function
    const closeModal = () => {
      if(screenWidth >= 640) {
        const body = document.body
        body.style.overflowY = "scroll"

        if(currentPage === "Home"){
          navigate("/")
        }
        else if(currentPage === "TV Shows" || location.pathname.includes("/browse/t/genre/tv")){
          navigate("/browse/genre/t0")
        }
        else if(currentPage === "Movies" || location.pathname.includes("/browse/t/genre/movie")){
          navigate("/browse/genre/m0")
        }
  
        setShowVideo(true)
        setPause(false)
      }
    }

    // Pause vide in hero when modal is open
    useEffect(() => {
      location.pathname.includes("/browse/m/genre/") && setShowVideo(false)
      location.pathname.includes("/browse/m/genre/") && setPause(true)
      location.pathname.includes("/browse/t/genre/") && setShowVideo(false)
      location.pathname.includes("/browse/t/genre/") && setPause(true)
    },[isDataLoading, showVideo])

    // Season dropdown controller
    const dropdownArray : string[] = ["Suggestions For You", "Year Released", "A-Z", "Z-A"]
    const [selectedSeason, setSelectedSeason] = useState<string>("Suggestions For You")
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const toggleSelect = () => {
      setCloseFilter(false)
      !closeFilter && setIsOpen(!isOpen)
    }
    
    const handleSelect = (option: string) => {
      setSelectedSeason(option)
      setIsOpen(false)
    }

    // Dropdown sorting function
    const filteredAndSortedResults = () => {
      if (!data?.results) return []
    
      switch (selectedSeason) {
        case "Year Released":
          return [...data.results].sort((a, b) => {
            const yearA = a.release_date ? new Date(a.release_date).getFullYear() : 0
            const yearB = b.release_date ? new Date(b.release_date).getFullYear() : 0
            return yearB - yearA
          })
        case "A-Z":
          return [...data.results].sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""))
        case "Z-A":
          return [...data.results].sort((a, b) => (b.title || b.name || "").localeCompare(a.title || a.name || ""))
        case "Suggestions For You":
        default:
          return data.results;
      }
    }

    // Closing dropdown
    const dropDownRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => dropDownRef.current && !dropDownRef.current.contains(event.target as Node) && setIsOpen(false)
      window.addEventListener("mousedown", handleClickOutside)
      return () => window.removeEventListener("mousedown", handleClickOutside)
    }, [dropDownRef])

    // Close Filter
    const [closeFilter, setCloseFilter] = useState<boolean>(false)

    // Device Checker
    const [deviceType, setDeviceType] = useState<string | null>(null)
    useEffect(() => {
      const userAgent = navigator.userAgent.toLowerCase()
      userAgent.match(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i) ? setDeviceType("Phone") : setDeviceType("Desktop")
    },[deviceType])
    
    // Items Functions Util
    const [itemHover, setItemHover] = useState<number | null>(null)
    const { handleHover, handleHoverOut } = useHoverHandlers()
    const { handleClickModal } = useClickHandlers()

    // Fetch trailer data
    const { data : myTrailerData, isFetched: isFetchedTrailer, isError: isTrailerError } = useQuery(
      ["trailerItemKey", itemHover, showDetails],
      () => getShowTrailer(!showDetails?.number_of_seasons ? "movie" : "tv", videoId)
    )

    // When done querying put the data in states variable
    useEffect(() => {
      // Trailer Data Query
      (isFetchedTrailer && !isTrailerError && myTrailerData?.results.length !== 0) && dataInEffect(myTrailerData)
    }, [itemHover, isFetchedTrailer, myTrailerData])

  return (
  (isDataLoading)  ? 
    <div className="h-[100dvh] w-full flex items-center justify-center">
     <CircularProgress sx={{color:"red"}}/>
    </div>
    :
		<div className="min-h-[100dvh] w-[90%] 801size:w-[85%] max-w-[96rem] bg-[#181818] mx-auto mt-9 rounded-xl overflow-hidden pb-[2.5rem]">
      <div className="mx-8 my-6">
        <LightTooltip title="Close">
          <p className="text-5xl mt-[-2px] text-white float-right cursor-pointer clear-both" onClick={closeModal}>&#215;</p>
        </LightTooltip>

        {/* Title */}
        <p className="pt-[3rem] text-center text-white clear-both text-5xl font-bold">{queryTypeValuesTitle[genreId || ""]}</p>

        {/* Filter Button */}
        <div className="flex float-right mx-10 mt-[6rem] mb-11">
          <button
            className={`border h-[2rem] px-3 hover:text-white hover:border-white ${closeFilter ? "border-white text-white" : "border-custom-light-2 text-custom-light-2"}`}
            onClick={() => {setCloseFilter(true)}}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-name="List" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M24 6H0V4H24V6ZM24 18V20H0V18H24ZM0 13H12V11H0V13Z" fill="currentColor"></path></svg>
          </button>

          {/* Dropdown */}
          <div className={`relative ${closeFilter ? "w-auto" : "w-[19rem]"}`} ref={dropDownRef}>
            <div 
              className={`h-[2rem] border text-sm px-4 cursor-pointer relative flex items-center gap-x-4 hover:text-white hover:border-white
                ${closeFilter ? "border-custom-light-2 bg-transparent text-custom-light-2" : "border-white bg-[#000000af] text-white"}`}
              onClick={toggleSelect}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-name="GridFill" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M1 3C0.447715 3 0 3.44772 0 4V10C0 10.5523 0.447715 11 1 11H10C10.5523 11 11 10.5523 11 10V4C11 3.44772 10.5523 3 10 3H1ZM1 13C0.447715 13 0 13.4477 0 14V20C0 20.5523 0.447715 21 1 21H10C10.5523 21 11 20.5523 11 20V14C11 13.4477 10.5523 13 10 13H1ZM13 4C13 3.44772 13.4477 3 14 3H23C23.5523 3 24 3.44772 24 4V10C24 10.5523 23.5523 11 23 11H14C13.4477 11 13 10.5523 13 10V4ZM14 13C13.4477 13 13 13.4477 13 14V20C13 20.5523 13.4477 21 14 21H23C23.5523 21 24 20.5523 24 20V14C24 13.4477 23.5523 13 23 13H14Z" fill="currentColor"></path></svg>

              {!closeFilter &&
                <>
                  {selectedSeason}
                  <span className="mr-[.5rem] absolute inset-y-0 right-0 flex items-center transition-transform">
                    <ArrowDropDownIcon/>
                  </span>
                </>
              }
            </div>
            
            {// Dropdown menu
            isOpen && (
              <div className="select-season absolute border py-2 border-white bg-[#000000ce] w-[15rem] ml-[4rem] z-[11] max-h-[23rem] overflow-y-scroll">
                {dropdownArray.map((item : string, index: number) => (
                  <div
                    key={index}
                    className="text-white text-sm px-4 cursor-pointer hover:underline flex items-center gap-x-2"
                    onClick={() => handleSelect(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Items Container */}
        <div className="clear-both mx-10 my-grid-genre">
        {
          filteredAndSortedResults()?.map((res : ItemType, index : number) => 
            <div
              key={index}
              className = "max-w-[17.5rem] h-[10rem]"
              onMouseOver={() => { 
                deviceType === "Desktop" && setItemHover(index + parseInt(res.id) + parseInt(res?.vote_count)) ; 
                handleHover((res?.media_type ? res?.media_type : categoryId || ""), res?.id) }}
              onMouseLeave={() => { deviceType === "Desktop" && setItemHover(null) ; handleHoverOut() }}
              onClick={(event) => screenWidth > 639 && handleClickModal(event, (res?.media_type ? res?.media_type : categoryId || ""), res?.id)}
            >
              <ItemSlider
                itemHover = {itemHover}
                index = {index + parseInt(res.id) + parseInt(res?.vote_count)}
                imageUrl = {res?.backdrop_path}
                trailerData = {trailerData}
                isFetchedTrailer = {isFetchedTrailer}
                mediaType = {res?.media_type ? res?.media_type : categoryId || ""}
                showDetails = {showDetails}
              />
            </div>    
          )
        }
        </div>
      </div>
		</div>
  )
}
