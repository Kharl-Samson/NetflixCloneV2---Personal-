import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Navigation }  from "swiper/modules"
import { useQuery } from "react-query"
import { getShowList, getShowTrailer } from "../../services/apiFetchShowList"
import { useEffect, useState } from "react"
import { ItemType } from "../../types/itemTypes"
import { useAppStore } from "../../store/ZustandStore"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import { ItemSliderTop10 } from "./ItemSliderTop10"
import { dataInEffect, swipeLeft, swipeRight, useHoverHandlers, useClickHandlers } from "../../utils/itemsFunction"
import { useNavigate } from "react-router-dom"

type SliderProps = {
  marginStyle : string
  sliderStyle? : string
  title : string
  queryType : string
  queryKey : string
  classCount : number
}

export const SliderTop10 = ({marginStyle, sliderStyle, title, queryType, queryKey, classCount} : SliderProps) => {
    // Navigate
    const navigate = useNavigate()

    // State from zustand
    const {screenWidth} = useAppStore()

    let dataCategory : string | null = null
    if(queryType === "Top 10 TV Shows"){
      dataCategory = "tv"
    }
    else if(queryType === "Top 10 Movies"){
      dataCategory = "movie"
    }

    // Fetch data to be showned in section
    const { data, isLoading } = useQuery(
      [`${queryKey}`, dataCategory],
      () => getShowList(queryType, dataCategory, "en-US", null, 1)
    )

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

    // React Youtube State
    const { videoId, trailerData, showDetails, triggerAnimItems } = useAppStore()

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

    // Swiper Controllers
    const [leftSwiperHover, setLeftSwiperHover] = useState<boolean>(false)
    const [rightSwiperHover, setRightSwiperHover] = useState<boolean>(false)
    const [swiperHover, setSwiperHover] = useState<boolean>(false)
    const [showLeftSwipe, setShowLeftSwipe] = useState<boolean>(false)

  return (
    <div className={`mt-3 sm:relative ${sliderStyle}`}>
      <p className={`text-white text-base sm:text-2xl font-semibold sm:font-bold mr-2 ${marginStyle}`}>{title}</p>
    
      {/* Slider Container */}
      <div 
        className="w-full h-auto mt-1 sm:mt-3" 
        onMouseOver={() => deviceType === "Desktop" && setSwiperHover(true)} 
        onMouseOut={() => deviceType === "Desktop" && setSwiperHover(false)}
      >
        {/* Swiper Controller */
        screenWidth >= 640 && !isLoading &&
        <div className="hidden sm:block">
          <div className={`cursor-pointer absolute h-[13rem] w-[3.75rem] bg-[hsla(0,0%,8%,.5)] text-white
              z-20 items-center justify-center custom-transition-duration-3s rounded-r ${swiperHover && showLeftSwipe ? "flex" : "hidden"}`}
            onClick={() => swipeLeft(classCount)}  
            onMouseOver={() => deviceType === "Desktop" && setLeftSwiperHover(true)}
            onMouseOut={() => deviceType === "Desktop" && setLeftSwiperHover(false)}
          >
            <KeyboardArrowLeftIcon sx={{ fontSize: leftSwiperHover ? "5rem" : "3rem", fontWeight: "bold", transition : ".3s"}}/>
          </div>
          <div className={`cursor-pointer absolute h-[13rem] w-[3.75rem] bg-[hsla(0,0%,8%,.5)] text-white right-0
              z-20 items-center justify-center custom-transition-duration-3s rounded-l ${swiperHover ? "flex" : "hidden"}`}
            onClick={()=> { setShowLeftSwipe(true) ; swipeRight(classCount)}} 
            onMouseOver={() => deviceType === "Desktop" && setRightSwiperHover(true)}
            onMouseOut={() => deviceType === "Desktop" && setRightSwiperHover(false)}
          >
            <KeyboardArrowRightIcon sx={{ fontSize: rightSwiperHover ? "5rem" : "3rem", fontWeight: "bold", transition : ".3s"}}/>
          </div>
        </div>
        }

        {/* Carousel Using React Swiper */
        isLoading ?
        <div className={`w-full h-[9rem] sm:h-[10rem] ${marginStyle} gap-x-2 flex`}>
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index} className="rounded-md itemSkeleton min-w-[6.5rem] w-[6.5rem] sm:min-w-[18rem] sm:w-[18rem] h-[9rem] sm:h-[10rem]">
            </div>
          ))}
        </div>
        :
        data?.results?.length > 1 && 
          <Swiper
            mousewheel={true}
            slidesPerView="auto"
            spaceBetween={screenWidth < 640 ? 8 : 20}
            navigation={true}
            modules={[Navigation]}
            className={`w-full h-[9rem] sm:h-[13rem] ${marginStyle} overflow-visible mySwiper`}
          >
            {
             data?.results?.length > 1 && data?.results?.map((res : ItemType, index : number) => (
              <SwiperSlide 
                key={res?.id}
                className={`swiperSlideSmall2 h-[9rem] sm:h-[13rem] overflow-hidden ${itemHover === index && triggerAnimItems && "sm:overflow-visible"}
                  ${index >= 10 && "hidden"} ${index === 0 && "ml-[-.5rem] sm:ml-0"} ${index === 9 && " mr-[7.7rem]"}`}
                onMouseLeave={() => { deviceType === "Desktop" && setItemHover(null) ; handleHoverOut() }}
                onClick={(event) => 
                  screenWidth > 639  ? 
                    // In Desktop
                    handleClickModal(event, (res?.media_type ? res?.media_type : queryType.includes("Movies") ? "movie" : "tv"), res?.id)
                    :
                    // In Smaller Devices
                    navigate(`/browse/${res?.media_type ? res?.media_type : queryType.includes("Movies") ? "movie" : "tv"}?q=${res?.id}`)
                }
              >
                {index < 10 &&
                  <ItemSliderTop10
                    itemHover = {itemHover}
                    index = {index}
                    imageUrl = {res?.poster_path}
                    trailerData = {trailerData}
                    isFetchedTrailer = {isFetchedTrailer}
                    mediaType = {res?.media_type ? res?.media_type : queryType.includes("Movies") ? "movie" : "tv"}
                    showDetails = {showDetails}
                    onMouseOver={() => { 
                      deviceType === "Desktop" && setItemHover(index) ; 
                      deviceType === "Desktop" && handleHover((res?.media_type ? res?.media_type : queryType.includes("Movies") ? "movie" : "tv"), res?.id) 
                    }}
                  />
                }
              </SwiperSlide>
              ))
            }
          </Swiper>
        }
      </div>
    </div>
  )
}