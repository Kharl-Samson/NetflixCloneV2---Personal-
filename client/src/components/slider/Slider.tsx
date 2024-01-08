import "swiper/css"
import "swiper/css/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Navigation }  from "swiper/modules"
import { useQuery } from "react-query"
import { getShowList } from "../../services/apiFetchShowList"
import { useMemo, useState } from "react"
import { ItemType } from "../../types/itemTypes"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { handleImageError } from "../../types/errorTypes"
import { useAppStore } from "../../store/ZustandStore"

type SliderProps = {
  titleStyles : string
  title : string
  queryType : string
  queryKey : string
}

export const Slider = ({titleStyles, title, queryType, queryKey} : SliderProps) => {
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

  // Swiper Controllers
  const [smallDeviceClick, setSmallDeviceClick] = useState<boolean>(false)
  const smallDevClick = () => setSmallDeviceClick(true)

  return (
    <div className="mt-3 801size:z-20 801size:relative 801size:mt-[-14rem]">
        <p className={`text-white text-lg sm:text-3xl font-medium sm:font-bold ${titleStyles}`}>{title}</p>

        {/* Slider Container */}
        <div className="w-full h-auto sm:mt-3">
            {/* Carousel Using React Swiper */}
            <Swiper
              mousewheel={true}
              slidesPerView={5}
              spaceBetween={7}
              grabCursor={false}
              loop={true}
              navigation={false}
              modules={[Navigation]}
              className="w-full h-[9rem] gap-x-4"
            >
              {
                combinedData?.results?.map((res : ItemType, index : number) => (
                  <SwiperSlide className={`h-full swiperSlide ${index === 0 && !smallDeviceClick && "ml-2"}`} key={index} onClick={smallDevClick}>
                    {/* In smaller device */
                    screenWidth < 640 &&
                      <LazyLoadImage
                        alt="Show Image"
                        src={`${import.meta.env.VITE_BASE_IMAGE_URL}${res?.poster_path}`} 
                        className="h-full w-full rounded block sm:hidden"
                        onError={handleImageError}
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
