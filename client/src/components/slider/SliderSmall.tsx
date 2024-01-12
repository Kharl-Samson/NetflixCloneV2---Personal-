import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Navigation }  from "swiper/modules"
import { useMutation, useQuery } from "react-query"
import { getShowDetails, getShowList, getShowTrailer } from "../../services/apiFetchShowList"
import { useEffect, useState } from "react"
import { ItemType } from "../../types/itemTypes"
import { useAppStore } from "../../store/ZustandStore"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import { ItemSliderSmall } from "./ItemSliderSmall"

type SliderProps = {
  marginStyle : string
  relativeStyle? : string
  title : string
  queryType : string
  queryKey : string
  classCount : number
}

type GetShowDetailsResponse = string

export const SliderSmall = ({marginStyle, relativeStyle, title, queryType, queryKey, classCount} : SliderProps) => {
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
  
    // Swiper Controllers
    const [smallDeviceClick, setSmallDeviceClick] = useState<boolean>(false)
    const smallDevClick = () => setSmallDeviceClick(true)
    smallDeviceClick && "" // Delete

    // React Youtube State
    const { showVideo, setShowVideoItems, setIsMutedItems, setPause, setTriggerAnimItems} = useAppStore()

    // Items functions in larger device
    const [trailerData, setTrailerData] = useState<string>("")
    const [category, setCategory] = useState<string>("")
    const [videoId, setVideoId] = useState<string>("")
    const [itemHover, setItemHover] = useState<number | null>(null)

    // fetch show details when hover
    const [showDetails, setShowDetails] = useState<string>("")
    let cancelToken: ReturnType<typeof getShowDetails> | undefined
    const mutation = useMutation<GetShowDetailsResponse, Error, { category: string; trailerId: string | number; language?: string }>(
      ({ category, trailerId, language }) =>
        getShowDetails(category, trailerId, language),
      {
        onSuccess: (res) => {
          setShowDetails(res)
        },
        onError: (error) => {
          console.log(error)
        },
        onMutate: async ({ category, trailerId, language }) => {
          cancelToken = getShowDetails(category, trailerId, language)
          return { cancelToken }
        }
      }
    )

    // Hover Show
    const handleHover = (index : number,  media_type : string, id : string) => {
      setCategory(media_type)
      setVideoId(id)
      setItemHover(index)
  
      mutation.mutate({
        category: media_type,
        trailerId: id,
        language: "en-US"
      })
    }

    // Remove hover on show
    const handleHoverOut = () => {
      setTriggerAnimItems(false)

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
    <div className={`mt-3 sm:z-40 ${relativeStyle}`}>
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
              <div className={`cursor-pointer absolute h-[13rem] w-[3.75rem] bg-[hsla(0,0%,8%,.5)] text-white
                  z-20 items-center justify-center custom-transition-duration-3s rounded-r ${swiperHover && showLeftSwipe ? "flex" : "hidden"}`}
                onClick={swipeLeft}  
                onMouseOver={() => deviceType === "Desktop" && setLeftSwiperHover(true)}
                onMouseOut={() => deviceType === "Desktop" && setLeftSwiperHover(false)}
              >
                <KeyboardArrowLeftIcon sx={{ fontSize: leftSwiperHover ? "5rem" : "3rem", fontWeight: "bold", transition : ".3s"}}/>
              </div>
              <div className={`cursor-pointer absolute h-[13rem] w-[3.75rem] bg-[hsla(0,0%,8%,.5)] text-white right-0
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
              slidesPerView={
                screenWidth <= 450 ? 2 : 
                screenWidth <= 600 ? 3 : 
                screenWidth <= 800 ? 2 : 
                screenWidth <= 985 ? 3 : 
                screenWidth <= 1300 ? 4 : 6 
              }
              spaceBetween={
                screenWidth < 640 ? 0 : 20
              }
              navigation={true}
              modules={[Navigation]}
              className={`w-full h-[9rem] sm:h-[13rem] ${marginStyle} overflow-visible mySwiper`}
              onSliderMove={smallDevClick}
            >
              {
               data?.results?.map((res : ItemType, index : number) => (
                  <SwiperSlide 
                    key={index}
                    className = {`swiperSlideSmall2 h-[9rem] sm:h-[13rem] cursor-pointer ${index >= 10 && "hidden"}`}
                    onMouseOver={() => deviceType === "Desktop" && handleHover(index, res?.media_type, res?.id)}
                    onMouseLeave={() => deviceType === "Desktop" && handleHoverOut()}
                  >
                    {index < 10 &&
                      <ItemSliderSmall
                        itemHover = {itemHover}
                        index = {index}
                        imageUrl = {res?.poster_path}
                        trailerData = {trailerData}
                        isFetchedTrailer = {isFetchedTrailer}
                        mediaType = {res?.media_type}
                        showDetails = {showDetails}
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
