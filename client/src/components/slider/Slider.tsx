import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Navigation }  from "swiper/modules"
import { useQuery } from "react-query"
import { getShowList, getShowTrailer } from "../../services/apiFetchShowList"
import { useEffect, useMemo, useState } from "react"
import { ItemType } from "../../types/itemTypes"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { handleImageError } from "../../types/errorTypes"
import { useAppStore } from "../../store/ZustandStore"
import play from "../../assets/images/icons/play.png"
import add from "../../assets/images/icons/add.png"
import down from "../../assets/images/icons/down.png"
import { styled } from "@mui/material/styles"
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import { YoutubePlayerItem } from "../../widgets/youtubePlayer/YoutubePlayerItem"

type SliderProps = {
  marginStyle : string
  title : string
  queryType : string
  queryKey : string
}

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

export const Slider = ({marginStyle, title, queryType, queryKey} : SliderProps) => {
    // State from zustand
    const {screenWidth} = useAppStore()

    let dataCategory1 : string | null = null, dataCategory2 : string | null = null
    if(queryType === "Trending Now"){
      dataCategory1 = null
      dataCategory2 = null
    }

    // Fetch data to be showned in hero section -> First Data
    const { data : data1, isFetched: isFetchedData1, isError: isDataError1 } = useQuery(
      [`${queryKey}1`, dataCategory1, dataCategory2],
      () => getShowList(queryType, dataCategory1, "en-US", null, 1)
    )

    // Fetch data to be showned in hero section -> Second Data
    const { data : data2, isFetched: isFetchedData2, isError: isDataError2 } = useQuery(
      [`${queryKey}2`, dataCategory1, dataCategory2],
      () => getShowList(queryType, dataCategory1, "en-US", null, 2)
    )

    // Combining the results when both requests have been resolved
    const combinedData = useMemo(() => {
      if (isFetchedData1 && !isDataError1 && isFetchedData2 && !isDataError2) {
        return {
          results: (data1?.results || []).concat(data2?.results || []),
        }
      }
      return null
    }, [isFetchedData1, data1, isFetchedData2, data2])

    // Device Checker
    const [deviceType, setDeviceType] = useState<string | null>(null)
    useEffect(() => {
      const userAgent = navigator.userAgent.toLowerCase()
      userAgent.match(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i) ? setDeviceType("Phone") : setDeviceType("Desktop")
    },[deviceType])
  
    // Swiper Controllers
    const [smallDeviceClick, setSmallDeviceClick] = useState<boolean>(false)
    const smallDevClick = () => setSmallDeviceClick(true)

    // Items functions in larger device
    const [trailerData, setTrailerData] = useState<string>("")
    const [category, setCategory] = useState<string>("")
    const [videoId, setVideoId] = useState<string>("")
    const [itemHover, setItemHover] = useState<number | null>(null)

    const handleHover = (index : number,  media_type : string, id : string) => {
      setCategory(media_type)
      setVideoId(id)
      setItemHover(index)
      showVideo && setPause(true)
    }
    const handleHoverOut = () => {
      setItemHover(null)
      setShowVideoItems(false)
      setTrailerData("")
      setCategory("")
      setVideoId("")
      setIsMutedItems(true)
      showVideo && setPause(false)
    }

    // Fetch trailer data
    const { data : myTrailerData, isFetched: isFetchedTrailer, isError: isTrailerError } = useQuery(
      ["trailerItemKey", itemHover],
      () => getShowTrailer(category, videoId)
    )

    // When done querying put the data in states variable
    useEffect(() => {
      // Trailer Data Query
      if(isFetchedTrailer && !isTrailerError && myTrailerData?.results.length !== 0){
          for(var i : number = 0 ; i < myTrailerData?.results.length ; i++){
            if (myTrailerData?.results[i]?.name?.toUpperCase().indexOf("OFFICIAL TRAILER") > -1){
              setTrailerData(myTrailerData?.results[i].key)
              break
            }
            else if(myTrailerData?.results[i]?.name?.includes("TRAILER")){
              setTrailerData(myTrailerData?.results[i].key)
              break
            }
            else{
              setTrailerData(myTrailerData?.results[0].key)
            }
          }
      }
    }, [itemHover, isFetchedTrailer, myTrailerData])
    

    const hoverStyle = `swiperSlideHover h-auto relative z-30 overflow-auto item-shadow mt-[-6.25rem] rounded-lg ${itemHover !== 0 && "ml-[-3.438rem]"}`

    // React Youtube State
    const { 
      showVideo, showVideoItems, setShowVideoItems, isMutedItems, setIsMutedItems,
      videoEndedItems, setVideoEndedItems, setPlayAgainItems, setPause
    } = useAppStore()

    const toggleVideoSound = () => {
      setPlayAgainItems(false)
      setIsMutedItems(!isMutedItems)
      
      if(videoEndedItems) {
        setVideoEndedItems(false)
        setShowVideoItems(true)
        setIsMutedItems(true)
        setPlayAgainItems(true)
      }
    }

  return (
    <div className="mt-3 sm:z-20 sm:relative sm:mt-[-14rem]">
        <p className={`text-white text-lg sm:text-3xl font-medium sm:font-bold ${marginStyle}`}>{title}</p>
    
        {/* Slider Container */}
        <div className="w-full h-auto sm:mt-3">
            {/* Carousel Using React Swiper */}
            <Swiper
              mousewheel={true}
              slidesPerView={7}
              spaceBetween={7}
              grabCursor={false}
              loop={true}
              navigation={true}
              modules={[Navigation]}
              className={`w-full h-[9rem] sm:h-auto ${marginStyle} overflow-visible mySwiper`}
              onSliderMove={smallDevClick}
            >
              {
               combinedData?.results?.map((res : ItemType, index : number) => (
                screenWidth < 640 ?
                  <SwiperSlide className={`h-full swiperSlide ${index === 0 && !smallDeviceClick && "ml-2"}`} key={index}>
                      <LazyLoadImage
                        alt="Show Image"
                        src={`${import.meta.env.VITE_BASE_IMAGE_URL}${res?.poster_path}`} 
                        className="h-full w-full rounded"
                        onError={handleImageError}
                      />
                  </SwiperSlide>
                  :
                  <SwiperSlide 
                    className = "swiperSlide h-[10rem]"
                    key={index}
                    onMouseOver={() => deviceType === "Desktop" && handleHover(index, res?.media_type, res?.id)}
                    onMouseLeave={() => deviceType === "Desktop" && handleHoverOut()}
                  >
                    <div
                      className = {`swiperSlide cursor-pointer bg-[#181818] h-[10rem] eachSwiper
                        rounded-md overflow-hidden custom-transition-duration-3s ${itemHover === index && hoverStyle}`
                      } 
                    >
                      {/* Show Cover */}
                      <LazyLoadImage
                        alt="Show Image"
                        src={`${import.meta.env.VITE_BASE_IMAGE_URL}${res?.backdrop_path}`} 
                        className={`w-full showSkeleton relative ${itemHover !== index && "rounded"}
                          custom-transition-duration-10s ${showVideoItems && itemHover === index ? "opacity-0 z-0" : "opacity-100 z-10"}`}
                        onError={handleImageError}
                      />

                      { /* Show Trailer Video */
                      itemHover === index &&
                        <div className={`w-full h-[14.063rem] mt-[-14.063rem] overflow-hidden flex items-center justify-center relative z-0`}>
                          <YoutubePlayerItem
                              id = "youtubePlayerItems"
                              videoId = {trailerData} 
                              duration = {1000}
                              isFetchedTrailer = {isFetchedTrailer}
                          />
                          {/* Sounds Controller */}
                          <div 
                            className={`h-[40px] w-[40px] absolute z-0 border-2 border-solid border-[#767576] text-[#767576] rounded-full items-center cursor-pointer 
                              justify-center transition duration-400 hover:bg-gray-600 hover:bg-opacity-35 flex mr-[-20.5rem] mt-[10rem]`} 
                            onClick={toggleVideoSound}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`Hawkins-Icon Hawkins-Icon-Standard ${showVideoItems && isMutedItems && !videoEndedItems ? "block" : "hidden"}`}><path d="M11 4.00003C11 3.59557 10.7564 3.23093 10.3827 3.07615C10.009 2.92137 9.57889 3.00692 9.29289 3.29292L4.58579 8.00003H1C0.447715 8.00003 0 8.44774 0 9.00003V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00003ZM5.70711 9.70714L9 6.41424V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70714ZM15.2929 9.70714L17.5858 12L15.2929 14.2929L16.7071 15.7071L19 13.4142L21.2929 15.7071L22.7071 14.2929L20.4142 12L22.7071 9.70714L21.2929 8.29292L19 10.5858L16.7071 8.29292L15.2929 9.70714Z" fill="currentColor"></path></svg>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`Hawkins-Icon Hawkins-Icon-Standard ${showVideoItems && !isMutedItems && !videoEndedItems ? "block" : "hidden"}`}><path d="M24 12C24 8.28699 22.525 4.72603 19.8995 2.10052L18.4853 3.51474C20.7357 5.76517 22 8.81742 22 12C22 15.1826 20.7357 18.2349 18.4853 20.4853L19.8995 21.8995C22.525 19.274 24 15.7131 24 12ZM11 4.00001C11 3.59555 10.7564 3.23092 10.3827 3.07613C10.009 2.92135 9.57889 3.00691 9.29289 3.29291L4.58579 8.00001H1C0.447715 8.00001 0 8.44773 0 9.00001V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00001ZM5.70711 9.70712L9 6.41423V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70712ZM16.0001 12C16.0001 10.4087 15.368 8.8826 14.2428 7.75739L12.8285 9.1716C13.5787 9.92174 14.0001 10.9392 14.0001 12C14.0001 13.0609 13.5787 14.0783 12.8285 14.8285L14.2428 16.2427C15.368 15.1174 16.0001 13.5913 16.0001 12ZM17.0709 4.92896C18.9462 6.80432 19.9998 9.34786 19.9998 12C19.9998 14.6522 18.9462 17.1957 17.0709 19.0711L15.6567 17.6569C17.157 16.1566 17.9998 14.1218 17.9998 12C17.9998 9.87829 17.157 7.84346 15.6567 6.34317L17.0709 4.92896Z" fill="currentColor"></path></svg>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`Hawkins-Icon Hawkins-Icon-Standard ${videoEndedItems ? "block" : "hidden"}`}><path d="M13.1747 3.07702C11.01 2.79202 8.81537 3.30372 6.99988 4.51679C5.18439 5.72987 3.8718 7.56158 3.30668 9.67065C2.74155 11.7797 2.96243 14.0223 3.92815 15.9806C4.89388 17.9389 6.53859 19.4794 8.55586 20.3149C10.5731 21.1505 12.8254 21.2242 14.893 20.5224C16.9606 19.8205 18.7025 18.391 19.7942 16.5L18.0622 15.5C17.2131 16.9708 15.8582 18.0826 14.2501 18.6285C12.642 19.1744 10.8902 19.1171 9.32123 18.4672C7.75224 17.8173 6.47302 16.6192 5.7219 15.096C4.97078 13.5729 4.79899 11.8287 5.23853 10.1883C5.67807 8.5479 6.69897 7.12324 8.11102 6.17973C9.52307 5.23623 11.23 4.83824 12.9137 5.05991C14.5974 5.28158 16.1432 6.10778 17.2629 7.3846C18.1815 8.43203 18.762 9.7241 18.9409 11.0921L17.5547 10.168L16.4453 11.8321L19.4453 13.8321C19.7812 14.056 20.2188 14.056 20.5547 13.8321L23.5547 11.8321L22.4453 10.168L20.9605 11.1578C20.784 9.27909 20.0201 7.49532 18.7666 6.06591C17.3269 4.42429 15.3395 3.36202 13.1747 3.07702Z" fill="currentColor"></path></svg>
                          </div>
                        </div>
                      }

                      {/* Show when hover */
                      itemHover === index &&
                        <div className="p-4">
                          {/* Buttons */}
                          <div className="flex items-center gap-x-2">
                            {/* Play */}
                            <div className="bg-white rounded-full h-11 w-11 flex items-center justify-center">
                              <img src={play} alt="Play Icon" className="h-5 ml-[.2rem]"/>
                            </div>

                            {/* Add to Mylist */}
                            <LightTooltip title = "Add to My List" arrow sx={{'& .MuiTooltip-arrow': {color: '#ffff',},}}>
                              <div className="bg-[#232323] rounded-full h-11 w-11 flex items-center justify-center border-2 border-[#8b8b8b]">
                                <img src={add} alt="Play Icon" className="h-5"/>
                              </div>
                            </LightTooltip>

                            {/* More Info */}
                            <LightTooltip title= "More Info" arrow sx={{'& .MuiTooltip-arrow': {color: '#ffff',},}}>
                              <div className="bg-[#232323] rounded-full h-11 w-11 flex items-center justify-center border-2 border-[#8b8b8b] ml-auto">
                                <img src={down} alt="Add to my list" className="mt-1 w-5"/>
                              </div>
                            </LightTooltip>
                          </div>

                          {/* Details */}
                          <div className="mt-4 flex items-center gap-x-2">
                            {/* Match Percentage */}
                            <p className="text-[#42c161] font-medium">96% Match</p>

                            {/* Age */}
                            <div className="text-[#9b9b9b] text-sm py-[2px] px-[7px] border border-[#9b9b9b]">13+</div>

                            {/* Season Count or Episode Count */}
                            <p className="text-[#9b9b9b] font-medium">6 Seasons</p>

                            {/* HD */}
                            <div className="text-white rounded text-xs py-[1px] px-[4px] border border-[#9b9b9b]">HD</div>
                          </div>

                          {/* Genre */}
                          <div className="mb-3 mt-4 flex flex-wrap gap-x-4 text-[#efefef]">
                            <p><b className="text-[#646464]">● &nbsp;</b> Slick</p>
                            <p><b className="text-[#646464]">● &nbsp;</b> Suspenseful</p>
                            <p><b className="text-[#646464]">● &nbsp;</b> Thriller</p>
                          </div>
                        </div>
                      }
                    </div>
                  </SwiperSlide>
                ))
              }
            </Swiper>
        </div>
    </div>
  )
}
