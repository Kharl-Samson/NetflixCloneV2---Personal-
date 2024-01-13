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
import { ItemSlider } from "./ItemSlider"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import { dataInEffect, swipeLeft, swipeRight, useHoverHandlers } from "../../utils/itemsFunction"

type SliderProps = {
  marginStyle : string
  relativeStyle? : string
  title : string
  queryType : string
  queryKey : string
  classCount : number
}

export const Slider = ({marginStyle, relativeStyle, title, queryType, queryKey, classCount} : SliderProps) => {
    // State from zustand
    const {screenWidth} = useAppStore()

    let dataCategory1 : string | null = null, dataCategory2 : string | null = null
    if(queryType === "Trending Now"){
      dataCategory1 = null
      dataCategory2 = null
    }

    // Fetch data to be showned in section -> First Data
    const { data : data1, isFetched: isFetchedData1, isError: isDataError1 } = useQuery(
      [`${queryKey}1`, dataCategory1, dataCategory2],
      () => getShowList(queryType, dataCategory1, "en-US", null, 1)
    )

    // Fetch data to be showned in section -> Second Data
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
  
    // Hovers Functions Util
    const [itemHover, setItemHover] = useState<number | null>(null)
    const { handleHover, handleHoverOut } = useHoverHandlers()
    
    // React Youtube State
    const { category, videoId, trailerData, showDetails} = useAppStore()

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
    <div className={`mt-3 sm:z-20 ${relativeStyle}`}>
        <p className={`text-white text-base sm:text-2xl font-semibold sm:font-bold ${marginStyle}`}>{title}</p>
    
        {/* Slider Container */}
        <div 
          className="w-full h-auto mt-1 sm:mt-3" 
          onMouseOver={() => deviceType === "Desktop" && setSwiperHover(true)} 
          onMouseOut={() => deviceType === "Desktop" && setSwiperHover(false)}
        >
            {/* Swiper Controller */
            screenWidth >= 640 &&
            <div className="hidden sm:block">
              <div className={`cursor-pointer absolute h-40 w-[3.75rem] bg-[hsla(0,0%,8%,.5)] text-white
                  z-20 items-center justify-center custom-transition-duration-3s rounded-r ${swiperHover && showLeftSwipe ? "flex" : "hidden"}`}
                onClick={() => swipeLeft(classCount)}  
                onMouseOver={() => deviceType === "Desktop" && setLeftSwiperHover(true)}
                onMouseOut={() => deviceType === "Desktop" && setLeftSwiperHover(false)}
              >
                <KeyboardArrowLeftIcon sx={{ fontSize: leftSwiperHover ? "5rem" : "3rem", fontWeight: "bold", transition : ".3s"}}/>
              </div>
              <div className={`cursor-pointer absolute h-40 w-[3.75rem] bg-[hsla(0,0%,8%,.5)] text-white right-0
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
              slidesPerView={7}
              spaceBetween={8}
              grabCursor={false}
              loop={true}
              navigation={true}
              modules={[Navigation]}
              className={`w-full h-[9rem] sm:h-auto ${marginStyle} overflow-visible mySwiper`}
            >
              {
               combinedData?.results?.map((res : ItemType, index : number) => (
                screenWidth < 640 ?
                  <SwiperSlide className="h-full swiperSlide" key={index}>
                      <LazyLoadImage
                        alt="Show Image"
                        src={`${import.meta.env.VITE_BASE_IMAGE_URL}${res?.poster_path}`} 
                        className="showSkeleton h-full w-full rounded"
                        onError={handleImageError}
                      />
                  </SwiperSlide>
                  :
                  <SwiperSlide 
                    className = "swiperSlide h-[10rem] cursor-pointer"
                    key={index}
                    onMouseOver={() => { deviceType === "Desktop" && setItemHover(index) ; handleHover(res?.media_type, res?.id) }}
                    onMouseLeave={() =>{ deviceType === "Desktop" && setItemHover(null) ; handleHoverOut() }}
                  >
                      <ItemSlider
                        itemHover = {itemHover}
                        index = {index}
                        imageUrl = {res?.backdrop_path}
                        trailerData = {trailerData}
                        isFetchedTrailer = {isFetchedTrailer}
                        mediaType = {res?.media_type}
                        showDetails = {showDetails}
                      />
                  </SwiperSlide>
                ))
              }
            </Swiper>
        </div>
    </div>
  )
}
