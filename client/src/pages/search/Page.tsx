import { useInfiniteQuery, useQuery } from "react-query"
import { getSearchQuery, getShowTrailer } from "../../services/apiFetchShowList"
import { dataInEffect, useClickHandlers, useHoverHandlers } from "../../utils/itemsFunction"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ItemType } from "../../types/itemTypes"
import { ItemSlider } from "../../components/slider/ItemSlider"
import { useAppStore } from "../../store/ZustandStore"

export const Page = () => {

    // Get search value params
    const urlParams = new URLSearchParams(window.location.search)
    const sParam = urlParams.get("s")

    // Fetch show data 
    const { data : searchData1, isFetched: isFetchedSearchData1 } = useQuery(
      ["searchDataKey1", sParam],
      () => sParam && getSearchQuery(sParam ? sParam : "Default", 1)
    )
    const { data : searchData2, isFetched: isFetchedSearchData2 } = useQuery(
      ["searchDataKey2", sParam],
      () => sParam && getSearchQuery(sParam ? sParam : "Default", 2)
    )
    const { data : searchData3, isFetched: isFetchedSearchData3 } = useQuery(
      ["searchDataKey3", sParam],
      () => sParam && getSearchQuery(sParam ? sParam : "Default", 3)
    )

    const combinedData = useMemo(() => {
      if (isFetchedSearchData1 && isFetchedSearchData2 && isFetchedSearchData3) {
        return {
          results: (searchData1?.results || []).concat(searchData2?.results || []).concat(searchData3?.results || []),
        }
      }
      return null
    }, [searchData1, searchData2, searchData3])

    // Fetch show data with infinite scroll
    const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery(
      ['searchDataKey', sParam],
      ({ pageParam = 1 }) => sParam && getSearchQuery(sParam ? sParam : "", pageParam),
      {
        getNextPageParam: (lastPage) => {
          return lastPage?.page < lastPage?.total_pages ? lastPage?.page + 1 : undefined
        }
      }
    )

    // Infinite scroll function
    const observer = useRef<IntersectionObserver>()
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
          entries[0].isIntersecting && hasNextPage && fetchNextPage()
      })
      if (node) observer.current.observe(node)
    }, [isFetchingNextPage, fetchNextPage, hasNextPage])

    // Zustand States
    const { videoId, trailerData, showDetails, screenWidth } = useAppStore()

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

  return (
    <section 
      className="max-w-[3000px] mx-auto mt-[4.3rem] 1051size:mt-[4.5rem] min-h-[100dvh] fixed inset-0 
        z-[49] bg-[#181414] overflow-y-scroll search-section px-7 1051size:px-14"
    >
        
      {data?.pages[0]?.total_results !== 0 ?
      <>
        {/* More related title  */}
        <div className="mt-[6rem] flex gap-x-5">
          <p className="text-2xl text-[#808080] whitespace-nowrap">More to explore: </p>
          <div className="mt-[-2px] flex flex-wrap items-center gap-x-3">
            {// Related title mapping
            combinedData && combinedData?.results
              .reduce((unique: {title: string}[], item: {title: string}) => {
                !unique.some(obj => obj?.title?.toUpperCase() === item?.title?.toUpperCase()) && unique.push(item)
                return unique
              }, [])
              .slice(0,5)
              .filter((res: { title:  string }) => res.title !== undefined)
              .map((res: {title : string}, index: number, array: {title: string}[]) => 
                <div key={res.title} className="flex items-center gap-x-3">
                  <p className="text-2xl text-white">{res.title}</p>
                  {index !== array.length - 1 && <div className="h-[2.2rem] w-[1px] bg-[#cfcfcf]"></div>}
                </div>
            )}
          </div>
        </div>

        <div className="my-grid-search mt-5 w-full">
          {data?.pages?.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {group.results?.map((res : ItemType, index : number) => {
                return (
                  <div
                    key={index}
                    className = "max-w-[17.5rem] h-[10rem] cursor-pointer hover:cursor-pointer"
                    onMouseOver={() => { deviceType === "Desktop" && setItemHover(index + parseInt(res.id) + parseInt(res?.vote_count)) ; handleHover(res?.media_type, res?.id) }}
                    onMouseLeave={() =>{ deviceType === "Desktop" && setItemHover(null) ; handleHoverOut() }}
                    onClick={(event) =>  
                      screenWidth > 639 && handleClickModal(event, res?.media_type, res?.id)
                    }
                  >
                    <ItemSlider
                      itemHover = {itemHover}
                      index = {index + parseInt(res.id) + parseInt(res?.vote_count)}
                      imageUrl = {res?.backdrop_path}
                      trailerData = {trailerData}
                      isFetchedTrailer = {isFetchedTrailer}
                      mediaType = {res?.media_type}
                      showDetails = {showDetails}
                    />
                  </div>
                )
              })}
            </React.Fragment>
          ))}
          <div ref={hasNextPage ? lastElementRef : null} className={`${hasNextPage && "h-[30dvh]"} w-full`}/>
        </div>
        {isFetchingNextPage && <p className="my-2 text-center mx-auto">Loading more...</p>}
      </>
      :
      <div className="mt-[5rem] flex justify-center">
        <div className="mx-auto">
          <p className="text-white text-sm">Your search for "{sParam}" did not have any matches.</p>
          <p className="text-white text-sm mt-3">Suggestions:</p>
          <ul className="list-disc ml-10 mt-3">
            <li className="text-white text-sm">Try different keywords</li>
            <li className="text-white text-sm">Looking for a movie or TV show?</li>
            <li className="text-white text-sm">Try using a movie, TV show title, an actor or director</li>
            <li className="text-white text-sm">Try a genre, like comedy, romance, sports, or drama</li>
          </ul>
        </div>
      </div>
      }
     
    </section>
  )
}
