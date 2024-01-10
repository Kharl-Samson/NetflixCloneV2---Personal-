import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Navigation }  from "swiper/modules"
import { useMutation, useQuery } from "react-query"
import { cancelGetShowDetails, getShowDetails, getShowList, getShowTrailer } from "../../services/apiFetchShowList"
import { useEffect, useMemo, useState } from "react"
import { ItemType } from "../../types/itemTypes"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { handleImageError } from "../../types/errorTypes"
import { useAppStore } from "../../store/ZustandStore"
import { ItemSlider } from "./ItemSlider"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"

type SliderProps = {
  marginStyle : string
  title : string
  queryType : string
  queryKey : string
  classCount : number
}

type GetShowDetailsResponse = string


export const Slider = ({marginStyle, title, queryType, queryKey, classCount} : SliderProps) => {
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

    // React Youtube State
    const { showVideo, setShowVideoItems, setIsMutedItems, setPause} = useAppStore()

    // Items functions in larger device
    const [trailerData, setTrailerData] = useState<string>("")
    const [category, setCategory] = useState<string>("")
    const [videoId, setVideoId] = useState<string>("")
    const [itemHover, setItemHover] = useState<number | null>(null)

    // fetch show details when hover
    const [isDetailsFetched, setDetailsFetched] = useState<boolean>(false)
    const mutation = useMutation<
      GetShowDetailsResponse, Error,
      { category: string; trailerId: string | number; language?: string }
    >(
      ({ category, trailerId, language }) =>
        getShowDetails(category, trailerId, language),
      {
        onSuccess: (res) => {
          console.log(res)
          setDetailsFetched(true)
        },
        onError: (error) => {
          console.log(error)
          setDetailsFetched(true)
        }
      }
    )

    const handleHover = (index : number,  media_type : string, id : string) => {
      mutation.mutate({
        category: media_type,
        trailerId: id,
        language: "en-US"
      })

      setCategory(media_type)
      setVideoId(id)
      setItemHover(index)
      showVideo && setPause(true)
    }

    const handleHoverOut = () => {
      setDetailsFetched(false)
      cancelGetShowDetails()
      
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
    
    // Swiper Controllers
    const [leftSwiperHover, setLeftSwiperHover] = useState<boolean>(false)
    const [rightSwiperHover, setRightSwiperHover] = useState<boolean>(false)
    const [swiperHover, setSwiperHover] = useState<boolean>(false)

    const [showLeftSwipe, setShowLeftSwipe] = useState<boolean>(false)
    const swipeLeft = () => {
      // @ts-ignore
      document.getElementsByClassName("swiper-button-prev")[classCount].click()
    }
    const swipeRight = () => {
      setShowLeftSwipe(true)
      // @ts-ignore
      document.getElementsByClassName("swiper-button-next")[classCount].click()
    }

  return (
    <div className="mt-3 sm:z-20 sm:relative sm:mt-[-14rem]">
        <p className={`text-white text-lg sm:text-3xl font-semibold sm:font-bold ${marginStyle}`}>{title}</p>
    
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
                onClick={swipeLeft}  
                onMouseOver={() => deviceType === "Desktop" && setLeftSwiperHover(true)}
                onMouseOut={() => deviceType === "Desktop" && setLeftSwiperHover(false)}
              >
                <KeyboardArrowLeftIcon sx={{ fontSize: leftSwiperHover ? "5rem" : "3rem", fontWeight: "bold", transition : ".3s"}}/>
              </div>
              <div className={`cursor-pointer absolute h-40 w-[3.75rem] bg-[hsla(0,0%,8%,.5)] text-white right-0
                  z-20 items-center justify-center custom-transition-duration-3s rounded-l ${swiperHover ? "flex" : "hidden"}`}
                onClick={swipeRight} 
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
                      <ItemSlider
                        itemHover = {itemHover}
                        index = {index}
                        imageUrl = {res?.backdrop_path}
                        trailerData = {trailerData}
                        isFetchedTrailer = {isFetchedTrailer}
                        isDetailsFetched = {isDetailsFetched}
                      />
                  </SwiperSlide>
                ))
              }
            </Swiper>
        </div>
    </div>
  )
}
