
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import SearchIcon from "@mui/icons-material/Search"
import { useNavigate } from "react-router-dom"
import CancelIcon from "@mui/icons-material/Cancel"
import { useInfiniteQuery, useQuery } from "react-query"
import { getSearchQuery, getShowList } from "../../services/apiFetchShowList"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { shuffleArray } from "../../utils/itemsFunction"
import { ItemType } from "../../types/itemTypes"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { handleImageError } from "../../types/errorTypes"
import { useAppStore } from "../../store/ZustandStore"
import React from "react"

export const Page = () => {
    // Get search value params
    const urlParams = new URLSearchParams(window.location.search)
    const sParam = urlParams.get("s")

    // Navigate
    const navigate = useNavigate()

    // Zustand State
    const { searchValue, setSearchValue } = useAppStore()

    // Fetch data to be showned in section -> First Data
    const { data : data1, isFetched: isFetchedData1, isError: isDataError1, isLoading : isDataLoading1 } = useQuery(
      ["trendingNow1", searchValue, sParam],
      () => !sParam && getShowList(
        "Trending Now",  // Query Type (ex. Hero, Romantic Movies, TV Action & Adventure, etc)
        null,            // Category (ex. tv or movie)
        "en-US",         // Language
        null,            // Genre
        1                // Page Number
      )
    )
      
    // Fetch data to be showned in section -> Second Data
    const { data : data2, isFetched: isFetchedData2, isError: isDataError2, isLoading : isDataLoading2 } = useQuery(
      ["trendingNow2", searchValue, sParam],
      () => !sParam && getShowList(
        "Trending Now",  // Query Type (ex. Hero, Romantic Movies, TV Action & Adventure, etc)
        null,            // Category (ex. tv or movie)
        "en-US",         // Language
        null,            // Genre
        2                // Page Number
      )
    )

    // Combining the results when both requests have been resolved
    const combinedData = useMemo(() => {
        if (isFetchedData1 && !isDataError1 && isFetchedData2 && !isDataError2) {
          const resultsCombined = (data1?.results || []).concat(data2?.results || [])
          return {
            results: shuffleArray(resultsCombined)
          }
        }
        return null
    }, [isFetchedData1, data1, isFetchedData2, data2, searchValue, sParam])

    // When the user inputted in search input
    const handleChange = (event: { target: { value: string } }) => setSearchValue(event?.target?.value)

    // Trigger when the search params is changed
    useEffect(() => {
      if(searchValue !== ""){
        navigate(`?s=${searchValue}`)
      }
      else if(searchValue === ""){
        navigate("/search")
        setSearchValue("")
      }
    },[searchValue, sParam])

    // Fetch show data with infinite scroll
    const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery(
      ['searchDataPoneKey', sParam, searchValue],
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

  return (
    <section className="w-full">
      {/* Back and search bar */}
      <div className="px-3 h-[3rem] flex items-center bg-[#181414] sticky top-0">
        <ArrowBackIosNewIcon onClick={() => navigate(-1)} style={{marginLeft:"-.5rem", color:"white"}}/>
        {/* Search input */}
        <div className="h-[2rem] ml-5 pr-1 bg-[#424242] flex-grow rounded flex items-center overflow-hidden">
          <SearchIcon style={{color:"#7c7c7c", fontSize:"1.75rem", margin:"0 .5rem"}}/>
          <input 
            type="text" 
            className="flex-grow mr-1 text-sm h-[1.9rem] outline-none placeholder-[#7c7c7c] border-none bg-transparent text-white"
            autoComplete="off"
            placeholder="Search shows, movies..."
            autoFocus
            value={searchValue}
            onChange={handleChange}
          />
          <CancelIcon style={{color:"#7c7c7c", fontSize:"1.1rem"}} onClick={() => setSearchValue("")}/>
        </div>
      </div>

      {/* Items list container */}
      <div className="mx-3 mt-1">
      { /* Show recommended items 
         * If no search value yet */
      !sParam ? 
        <>
          <p className="text-white text-base font-semibold">Recommended TV Shows & Movies</p>

          {/* Items Container */}
          <div className="mt-2 w-full flex flex-col gap-y-[.30rem] pb-[5rem]">
            {(isDataLoading1 && isDataLoading2) ?
              Array.from({ length: 10 }, (_, index) => (
                <div key={index} className="rounded itemSkeleton w-full h-[4rem]">
                </div>
              ))
            :
            combinedData && combinedData?.results?.length > 1 && 
            combinedData?.results?.map((res : ItemType, index : number) => (
              <div key={index} className="w-full h-[4rem] flex items-center gap-x-3" onClick={() => navigate(`/browse/${res?.media_type}?q=${res?.id}`)}>
                <LazyLoadImage
                  alt="Show Image"
                  src={`${res?.backdrop_path && import.meta.env.VITE_BASE_IMAGE_URL}${res?.backdrop_path}`} 
                  className="h-full w-[7rem] min-[7rem] rounded itemSkeleton"
                  onError={handleImageError}
                />

                {/* Title */}
                <p className="text-[#e7e6e6] text-sm font-bold max-w-[13rem]">
                  {res?.title || res?.name || res?.original_title}
                </p>

                {/* Play Icon */}
                <div className="rounded-full h-[2rem] w-[2rem] modal-background border-[3px] border-[#e7e6e6] flex items-center justify-center ml-auto mr-[1rem]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#e7e6e6]" data-name="Play" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg>
                </div>
              </div>
            ))}
          </div>
        </> 
      :
      /* Show items search
       * If search value is true */
        <>
          <p className="text-white text-base font-semibold fixed bg-[#181414] w-full h-[2rem] mt-[-.50rem] pt-2">Movies & TV</p>

          {/* Items Container */}
          <div className="pt-8 w-full gap-[.40rem] pb-[5rem] grid grid-cols-3">
            {data?.pages?.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {group.results?.map((res : ItemType, index : number) => {
                  return (
                  res?.poster_path &&
                    <LazyLoadImage
                      key={index}
                      alt="Show Image"
                      src={`${import.meta.env.VITE_BASE_IMAGE_URL}${res?.poster_path}`} 
                      className="showSkeleton w-full h-[11.5rem] rounded"
                      onError={handleImageError}
                      onClick={() => navigate(`/browse/${res?.media_type}?q=${res?.id}`)}
                    />
                  )
                })}
              </React.Fragment>
            ))}
            <div ref={hasNextPage ? lastElementRef : null} className={`${hasNextPage && "h-[30dvh]"} w-full`}/>
          </div>
        </>
      }
      </div>
    </section>
  )
}
