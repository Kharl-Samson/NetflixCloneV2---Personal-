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
import { dataInEffect, swipeLeft, swipeRight, useHoverHandlers } from "../../utils/itemsFunction"

type SliderProps = {
  marginStyle : string
  relativeStyle? : string
  title : string
  queryType : string
  queryKey : string
  classCount : number
}

export const SliderTop10 = ({marginStyle, relativeStyle, title, queryType, queryKey, classCount} : SliderProps) => {
    // State from zustand
    const {screenWidth} = useAppStore()

    let dataCategory : string | null = null
    if(queryType === "Top 10 TV Shows"){
      dataCategory = "tv"
    }

    // Fetch data to be showned in section
    const { data } = useQuery(
      [`${queryKey}`, dataCategory],
      () => getShowList(queryType, dataCategory, "en-US", null, 1)
    )

    // Device Checker
    const [deviceType, setDeviceType] = useState<string | null>(null)
    useEffect(() => {
      const userAgent = navigator.userAgent.toLowerCase()
      userAgent.match(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i) ? setDeviceType("Phone") : setDeviceType("Desktop")
    },[deviceType])
  
    // Hovers Functions Util
    const [itemHover, setItemHover] = useState<number | null>(null)
    const { handleHover, handleHoverOut } = useHoverHandlers()

    // React Youtube State
    const { category, videoId, trailerData, showDetails, triggerAnimItems } = useAppStore()

    // Fetch trailer data
    const { data : myTrailerData, isFetched: isFetchedTrailer, isError: isTrailerError } = useQuery(
      ["trailerItemKey", itemHover],
      () => getShowTrailer(category, videoId)
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
    <div className={`mt-3 sm:z-40 ${relativeStyle}`}>
        <p className={`text-white text-base sm:text-2xl font-semibold sm:font-bold mr-2 ${marginStyle}`}>{title}</p>
    
        {/* Slider Container */}
        <div 
          className="w-full h-auto mt-1 sm:mt-3" 
          onMouseOver={() => deviceType === "Desktop" && setSwiperHover(true)} 
          onMouseOut={() => deviceType === "Desktop" && setSwiperHover(false)}
        >
            {/* Swiper Controller */
            screenWidth >= 640 &&
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

            {/* Carousel Using React Swiper */}
            <Swiper
              mousewheel={true}
              slidesPerView="auto"
              spaceBetween={screenWidth < 640 ? 8 : 20}
              navigation={true}
              modules={[Navigation]}
              className={`w-full h-[9rem] sm:h-[13rem] ${marginStyle} overflow-visible mySwiper`}
            >
              {
               data?.results?.map((res : ItemType, index : number) => (
                  <SwiperSlide 
                    key={index}
                    className = {`swiperSlideSmall2 h-[9rem] sm:h-[13rem] ${index >= 10 && "hidden"} 
                      sm:overflow-hidden ${itemHover === index && triggerAnimItems && "sm:overflow-visible"}
                      ${index === 0 && "ml-[-.5rem] sm:ml-0"} ${index === 9 && "ml-[1.5rem] mr-[7.5rem]"}`}
                    onMouseLeave={() =>{ deviceType === "Desktop" && setItemHover(null) ; handleHoverOut() }}
                  >
                    {index < 10 &&
                      <ItemSliderTop10
                        itemHover = {itemHover}
                        index = {index}
                        imageUrl = {res?.poster_path}
                        trailerData = {trailerData}
                        isFetchedTrailer = {isFetchedTrailer}
                        mediaType = {res?.media_type}
                        showDetails = {showDetails}
                        onMouseOver={() => { deviceType === "Desktop" && setItemHover(index) ; handleHover(res?.media_type, res?.id) }}
                      />
                    }
                  </SwiperSlide>
                ))
              }
            </Swiper>
        </div>
    </div>
  )
}
