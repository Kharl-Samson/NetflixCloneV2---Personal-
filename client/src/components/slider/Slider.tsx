import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Navigation }  from "swiper/modules"
import { useQuery } from "react-query"
import { getShowList } from "../../services/apiFetchShowList"
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
    const [itemHover, setItemHover] = useState<number | null>(null)
    const handleHover = (index : number) => setItemHover(index)
    const hoverStyle = `swiperSlideHover h-auto relative z-30 overflow-auto item-shadow mt-[-6.25rem] rounded-lg ${itemHover !== 0 && "ml-[-3.438rem]"}`

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
                    onMouseOver={() => deviceType === "Desktop" && handleHover(index)}
                    onMouseLeave={() => deviceType === "Desktop" && setItemHover(null)}
                  >
                    <div
                      className = {`swiperSlide cursor-pointer bg-[#181818] h-[10rem] eachSwiper
                        rounded-md overflow-hidden custom-transition-duration-3s ${itemHover === index && hoverStyle}`
                      } 
                    >
                      <LazyLoadImage
                        alt="Show Image"
                        src={`${import.meta.env.VITE_BASE_IMAGE_URL}${res?.backdrop_path}`} 
                        className={`w-full showSkeleton ${itemHover !== index && "rounded"}`}
                        onError={handleImageError}
                      />

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
