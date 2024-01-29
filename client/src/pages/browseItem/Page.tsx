import { getCasts, getShowDetails, getShowTrailer } from "../../services/apiFetchShowList"
import { useQuery } from "react-query"
import { useEffect } from "react"
import { dataInEffect, useRouteAndQueryParams } from "../../utils/itemsFunction"
import { VideoSection } from "./components/VideoSection"
import Skeleton from "@mui/material/Skeleton"
import { useAppStore } from "../../store/ZustandStore"
import { ShowDescription } from "./components/ShowDescription"

export const Page = () => {
    // Params Url Getter
    const { params, categoryParams } = useRouteAndQueryParams()
    
    // Get Screen Width
    const { screenWidth } = useAppStore()

    // Fetch show data 
    const { data : showDetailsData, isFetched: isFetchedShowDetails , isLoading: isShowDetailsLoading } = useQuery(
      ["showDetailsPhoneKey", params],
      () => getShowDetails(categoryParams, params, "en-US"),
      { cacheTime: 0 } // Remove caching to trigger every click
    )
  
    // Fetch trailer data
    const { data : myTrailerData, isFetched: isFetchedTrailer, isError: isTrailerError , isLoading: isTrailerLoading } = useQuery(
      ["trailerModalKey", params],
      () => getShowTrailer(categoryParams, params),
      { cacheTime: 0 } // Remove caching to trigger every click
    )

    // Fetch Casts
    const { data : castsData, isFetched: isFetchedCasts, isLoading: isCastsLoading } = useQuery(
      ["castKey", params],
      () => getCasts(categoryParams, params),
      { cacheTime: 0 } // Remove caching to trigger every click
    )

    // Setting Web Title
    useEffect(() => {
      if (isFetchedShowDetails && !isShowDetailsLoading) {
        document.title = `${showDetailsData.name || showDetailsData.original_title} - Netflix Clone by Kharl`
      }
    },[showDetailsData])

    // When done querying put the data in states variable
    useEffect(() => {
      // Trailer Data Query
      (isFetchedTrailer && !isTrailerError && myTrailerData?.results.length !== 0) && dataInEffect(myTrailerData)
    }, [isFetchedTrailer, myTrailerData, isFetchedCasts, castsData, isFetchedShowDetails, showDetailsData])

  return (
    (isCastsLoading && isShowDetailsLoading && isTrailerLoading) ?
    <>
      <Skeleton variant="rectangular" animation="wave" width={"100%"} height={screenWidth < 400 ? "13rem" : "17rem"}/>
      <div className="flex flex-col mt-2 mx-2 gap-y-2">
        {Array.from({ length: 3 }, (_, index) => (
              <Skeleton variant="rounded" animation="wave" width={"100%"} height={"2rem"} key={index}/>
        ))}
      </div>
    </>
    :
    <section>
      {/* Video Player */}
      <VideoSection
        isFetchedTrailer = {isFetchedTrailer}
        showDetailsData = {showDetailsData}
      />

      {/* Details */}
      <ShowDescription showDetailsData = {showDetailsData}/>

    </section>
  )
}
