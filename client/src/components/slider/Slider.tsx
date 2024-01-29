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
import { dataInEffect, swipeLeft, swipeRight, useClickHandlers, useHoverHandlers } from "../../utils/itemsFunction"
import { useNavigate } from "react-router-dom"

type SliderProps = {
  marginStyle : string
  sliderStyle? : string
  title : string
  queryType : string
  queryKey : string
  classCount : number
}

export const Slider = ({marginStyle, sliderStyle, title, queryType, queryKey, classCount} : SliderProps) => {
    // Navigate
    const navigate = useNavigate()

    // State from zustand
    const {screenWidth} = useAppStore()

    let dataCategory1 : string | null = null, dataCategory2 : string | null = null
    if(queryType === "Trending Now"){
      dataCategory1 = null
      dataCategory2 = null
    }
    else if(queryType.includes("Movies")){
      dataCategory1 = "movie"
      dataCategory2 = "movie"
    }
    else if(queryType.includes("TV")){
      dataCategory1 = "tv"
      dataCategory2 = "tv"
    }

    // Fetch data to be showned in section -> First Data
    const { data : data1, isFetched: isFetchedData1, isError: isDataError1 } = useQuery(
      [`${queryKey}1`, dataCategory1, dataCategory2],
      () => getShowList(
        queryType,                                                    // Query Type (ex. Hero, Romantic Movies, TV Action & Adventure, etc)
        dataCategory1,                                                // Category (ex. tv or movie)
        queryType === "Romantic Movies" ? null : "en-US",             // Language
        queryType === "Romantic Movies" ? 
        10749 : queryType === "TV Action & Adventure" ? 10759 : null, // Genre
        1                                                             // Page Number
      )
    )

    // Fetch data to be showned in section -> Second Data
    const { data : data2, isFetched: isFetchedData2, isError: isDataError2 } = useQuery(
      [`${queryKey}2`, dataCategory1, dataCategory2],
      () => getShowList(
        queryType,                                            // Query Type (ex. Hero, Romantic Movies, TV Action & Adventure, etc)
        dataCategory1,                                        // Category (ex. tv or movie)
        queryType === "Romantic Movies" ? null : "en-US",     // Language
        queryType === "Romantic Movies" ? 10749 : 
        queryType === "TV Action & Adventure" ? 10759 : null, // Genre
        2                                                     // Page Number
      )
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
  
    // Items Functions Util
    const [itemHover, setItemHover] = useState<number | null>(null)
    const { handleHover, handleHoverOut } = useHoverHandlers()
    const { handleClickModal } = useClickHandlers()

    // React Youtube State
    const { videoId, trailerData, showDetails } = useAppStore()

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

    // Explore All Hover
    const [sliderTitleHover, setSliderTitleHover] = useState<boolean>(false)
    const [exploreHover, SetExploreHover] = useState<boolean>(false)

  return (
    <div className={`mt-3 sm:relative ${sliderStyle}`}
      onMouseOver={() => setSliderTitleHover(true)} 
      onMouseLeave={() => setSliderTitleHover(false)}
    >
        <div className="w-full flex items-center gap-x-1">
          <p className={`text-white text-base sm:text-2xl font-semibold sm:font-bold ${marginStyle}`}>{title}</p>
          <div 
            className={`custom-transition-duration-10s hidden items-center disable-highlight text-[#54b9c5] text-base font-extrabold 
              mt-[.4rem] cursor-pointer ${deviceType === "Desktop" && sliderTitleHover && "sm:flex"} ${exploreHover && "pl-3"}`}
            onMouseOver={() => SetExploreHover(true)} 
            onMouseLeave={() => SetExploreHover(false)}
          > 
            <p className={`custom-transition-duration-3s whitespace-nowrap overflow-hidden ${exploreHover ? "w-[5rem]" : "w-0"}`}>Explore All</p>
            <div className={`custom-transition-duration-3s mt-[0rem] border-t-4 border-r-4 border-[#54b9c5] rotate-45 ${exploreHover ? "h-[10px] w-[10px]" : "h-[13px] w-[13px]"}`}></div>
          </div>
        </div>
        
    
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

          {/* Carousel Using React Swiper */
          combinedData?.results?.length > 1 && 
            <Swiper
              mousewheel={true}
              slidesPerView="auto"
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
                        src={`${res?.poster_path && import.meta.env.VITE_BASE_IMAGE_URL}${res?.poster_path}`} 
                        className="showSkeleton h-full w-full rounded"
                        onError={handleImageError}
                        onClick={() => navigate(`/browse/${res?.media_type ? res?.media_type : queryType.includes("Movies") ? "movie" : "tv"}?q=${res?.id}`)}
                      />
                  </SwiperSlide>
                  :
                  <SwiperSlide 
                    className = "swiperSlide h-[10rem] cursor-pointer hover:cursor-pointer"
                    key={index}
                    onMouseOver={() => { deviceType === "Desktop" && setItemHover(index) ; handleHover((res?.media_type ? res?.media_type : queryType.includes("Movies") ? "movie" : "tv"), res?.id) }}
                    onMouseLeave={() =>{ deviceType === "Desktop" && setItemHover(null) ; handleHoverOut() }}
                    onClick={(event) =>  
                      deviceType === "Desktop" && handleClickModal(event, (res?.media_type ? res?.media_type : queryType.includes("Movies") ? "movie" : "tv"), res?.id)
                    }
                  >
                      <ItemSlider
                        itemHover = {itemHover}
                        index = {index}
                        imageUrl = {res?.backdrop_path}
                        trailerData = {trailerData}
                        isFetchedTrailer = {isFetchedTrailer}
                        mediaType = {res?.media_type ? res?.media_type : queryType.includes("Movies") ? "movie" : "tv"}
                        showDetails = {showDetails}
                      />
                  </SwiperSlide>
                ))
              }
            </Swiper>
          }
        </div>
    </div>
  )
}
