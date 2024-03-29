import { useEffect, useRef, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import { useQuery } from "react-query"
import { getCollections, getEpisodeDetails, getShowList, getSimilarShows } from "../../../../services/apiFetchShowList"
import down from "../../../../assets/images/icons/down.png"
import Skeleton from "@mui/material/Skeleton"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { handleImageError } from "../../../../types/errorTypes"
import { styled } from "@mui/material/styles"
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import add from "../../../../assets/images/icons/add.png"
import { useClickHandlers, useRouteAndQueryParams } from "../../../../utils/itemsFunction"

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

type EpisodeListsProps = {
  castsData : {
    cast : {
        original_name : string
    }[]
    crew? : {
      name : string
    }
  }
  showDetailsData : {
    title? : string
    original_title? : string
    name? : string
    id : string
    number_of_seasons? : number
    tagline? : string
    created_by : {
      name : string
    }[]
    genres : {
      name : string
    }[]
    seasons : {
      season_number : number
      episode_count: number
    }[]
    belongs_to_collection? : {
      id : string
      name : string
    }
  }
  age : string
}

export const EpisodeLists = ({castsData, showDetailsData, age} : EpisodeListsProps) => {
    // Params Url Getter
    const { params, categoryParams } = useRouteAndQueryParams()

    // Season dropdown controller
    const [selectedSeason, setSelectedSeason] = useState<number>(1)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const toggleSelect = () => setIsOpen(!isOpen)
    const handleSelect = (option: number) => {
      setSelectedSeason(option)
      setIsOpen(false)
    }

    // Closing dropdown
    const dropDownRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => dropDownRef.current && !dropDownRef.current.contains(event.target as Node) && setIsOpen(false)
      window.addEventListener("mousedown", handleClickOutside)
      return () => window.removeEventListener("mousedown", handleClickOutside)
    }, [dropDownRef])

    // Fetch Episode Details
    const { data : episodeData, isLoading: isLoadingEpisode } = useQuery(
      ["episodeKey", selectedSeason],
      () => showDetailsData?.number_of_seasons && getEpisodeDetails(showDetailsData?.id, selectedSeason)
    )
    
    // State for episodes list size to show in data
    const [episodeSize, setEpisodeSize] = useState<number>(10)

    // When episode item is hover -> show play icon
    const [hoverStatus, setHoverStatus] = useState<boolean>(false)
    const [hoverItemIndex, setHoverItemIndex] = useState<number | null>(null)
    const hoverEpisodeItem = (id : number | null) => {
      setHoverItemIndex(id)
      setHoverStatus(true)
    }
    const hoverOutEpisodeItem = () => {
      setHoverItemIndex(null)
      setHoverStatus(false)
    }

    // When item is hover in more like this section -> show play icon
    const [hoverStatusLikeThis, setHoverStatusLikeThis] = useState<boolean>(false)
    const [hoverItemIndexLikeThis, setHoverItemIndexLikeThis] = useState<number | null>(null)
    const hoverEpisodeItemLikeThis = (id : number | null) => {
      setHoverItemIndexLikeThis(id)
      setHoverStatusLikeThis(true)
    }
    const hoverOutEpisodeItemLikeThis = () => {
      setHoverItemIndexLikeThis(null)
      setHoverStatusLikeThis(false)
    }
    
    // When item is hover in collection section -> show play icon
    const [hoverStatusCollection, setHoverStatusCollection] = useState<boolean>(false)
    const [hoverItemIndexCollection, setHoverItemIndexCollection] = useState<number | null>(null)
    const hoverEpisodeItemCollection = (id : number | null) => {
      setHoverItemIndexCollection(id)
      setHoverStatusCollection(true)
    }
    const hoverOutEpisodeItemCollection = () => {
      setHoverItemIndexCollection(null)
      setHoverStatusCollection(false)
    }
    
    // Sentece Cutter
    const sentenceCutter = (size: number, text: string): string => {
      const sentences = text.match(/[^.!?]+[.!?]+/g);
      return sentences ? sentences.slice(0, size).join(" ") : text;
    }

    // Fetch Collections Show
    const { data : collectionData, isLoading: isLoadingCollection } = useQuery(
      ["collectionKey", params, selectedSeason],
      () => showDetailsData?.belongs_to_collection && getCollections(showDetailsData?.belongs_to_collection?.id)
    )

    // Fetch Similar Shows
    const { data : similarShowsData, isLoading: isLoadingSimilarShows } = useQuery(
      ["similarShowsKey", params, categoryParams],
      () => getSimilarShows(categoryParams, params, 1)
    )

    // Fetch Trending tv show if similar Show is invalid
    const { data : trendingShowsData, isLoading: isLoadingTrendingShows } = useQuery(
      ["trendingNow1", params],
      () => getShowList(
        "Trending Now", // Query Type (ex. Hero, Romantic Movies, TV Action & Adventure, etc)
        "tv",           // Category (ex. tv or movie)
        "en-US",        // Language
        null,           // Genre
        1               // Page Number
      )
    )

    // State for similar show list size to show in data
    const [similarShowSize, setSimilarShowSize] = useState<number>(9)

    // Random Array - [Match and Age]
    const matchArray : string[] = ["95", "96","97", "98"]
    const ageArray : string[] = ["10", "13", "16"]

    // State to store the random ages and mathes
    const [ageRandom1, setAgeRandom1] = useState<string[]>([])
    const [matchRandom1, setMatchRandom1] = useState<string[]>([])
    const [ageRandom2, setAgeRandom2] = useState<string[]>([])
    const [matchRandom2, setMatchRandom2] = useState<string[]>([])

    // Effect to generate ages when the component mounts or items change
    useEffect(() => {
      setMatchRandom1(collectionData && collectionData?.parts?.map(() => matchArray[Math.floor(Math.random() * matchArray.length)]))
      setAgeRandom1(collectionData && collectionData?.parts?.map(() => ageArray[Math.floor(Math.random() * ageArray.length)]))

      setMatchRandom2(
        (similarShowsData?.results.length !== 0 ? 
          similarShowsData : trendingShowsData)?.results?.map(() => matchArray[Math.floor(Math.random() * matchArray.length)])
      )

      setAgeRandom2(
        (similarShowsData?.results.length !== 0 ? 
          similarShowsData : trendingShowsData)?.results?.map(() => ageArray[Math.floor(Math.random() * ageArray.length)])
      )
    }, [collectionData, similarShowsData, trendingShowsData]) 
  
    // Items Functions Util
    const { navigateToWatch } = useClickHandlers()
    
  return (
    <div className="relative mt-10 px-11">

      {/*
        * If the item is TV Show
        * Episode Title and Season Identifier, dropdown 
        */
        showDetailsData?.number_of_seasons &&
        <div className="w-full flex justify-between items-start gap-x-10">
          <p className="text-white text-2xl font-semibold tracking-wide">Episodes</p>

          {showDetailsData?.number_of_seasons === 1 ?
            // If 1 Season only
            <p className="text-white text-xl">Season {showDetailsData?.number_of_seasons}</p>
            :
            // If more than 1 season
            <div className="relative w-[11rem] " ref={dropDownRef}>
              <div 
                className="rounded border border-[#424242] bg-[#242424] text-white py-2 px-4 cursor-pointer relative"
                onClick={toggleSelect}
              >
                Season {selectedSeason}
                <span className={`mr-[.5rem] absolute inset-y-0 right-0 flex items-center transition-transform ${isOpen ? "transform rotate-180" : ""}`}>
                  <ArrowDropDownIcon/>
                </span>
              </div>
              
              {// Dropdown menu
              isOpen && (
                <div className="select-season absolute border border-[#424242] mt-[2px] bg-[#242424] w-[15rem] ml-[-4rem] z-10 max-h-[23rem] overflow-y-scroll">
                  {showDetailsData?.seasons?.map((res : {season_number: number, episode_count: number}, index: number) => (
                    res?.season_number !== 0 && (
                      <div
                        key={index}
                        className="text-white py-2 px-4 cursor-pointer hover:bg-[#424242] flex items-center gap-x-2"
                        onClick={() => handleSelect(res?.season_number)}
                      >
                        Season {res?.season_number} <span className="text-sm">{`(${res?.episode_count} Episodes)`}</span>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          }
        </div>
      }

      {/* 
        * If item is TV Show
        * Show season identifier and age restriction
        */
        showDetailsData?.number_of_seasons && showDetailsData?.number_of_seasons > 1 &&
        <div className="mt-1 flex items-center gap-x-2">
          <p className="text-white text-sm font-medium tracking-wide">Season {selectedSeason}:</p>
          {/* Age */}
          <div className="text-white float-left text-sm px-[5px] border border-white">{age}+</div>
        </div>
      }

      {/*
        * If the item is TV Show 
        * Episodes lists section
        */
        showDetailsData?.number_of_seasons &&
        <div className="mt-2 w-full">
          {// If data is loading
          isLoadingEpisode ?
            <div className="flex flex-col gap-y-2">
              {Array.from({ length: 10 }, (_, index) => (
                <Skeleton variant="rounded" animation="wave" width={"100%"} height={"8rem"} key={index}/>
              ))}
            </div>
          :
          // Episode Data Mapping
          episodeData?.episodes?.slice(0, episodeSize).map((
            res : {
              id: number, 
              episode_number: number, 
              still_path: string,
              name: string,
              runtime: number,
              overview: string
              show_id: number
              season_number: number
            },
            index : number
          ) => (
            <div 
              key={index}
              className="rounded w-full py-7 border-b border-[#424242] flex items-center gap-x-5 cursor-pointer" 
              onMouseOver={() => hoverEpisodeItem(res?.id)}
              onMouseOut={hoverOutEpisodeItem}
              onClick={() => navigateToWatch("tv", res?.show_id, res?.season_number, res?.episode_number)}
            >
              {/* Episode Number */}
              <p className="text-[#d2d2d2] text-2xl w-[3.4rem] min-w-[3.4rem] text-right">{index + 1}</p>

              {/* Poster */}
              <LazyLoadImage
                alt="Episode Banner Image"
                src={`${res?.still_path && import.meta.env.VITE_BASE_IMAGE_URL}${res?.still_path}`} 
                className="h-[4.9rem] w-[8.7rem] min-w-[8.7rem] rounded bg-[#131313]"
                onError={handleImageError}
              />
              {/* Play Icon */}
              <div className="h-[4.9rem] w-[8.7rem] min-w-[8.7rem] ml-[-9.95rem] flex items-center justify-center relative z-10">
                <div 
                  className={`rounded-full h-[3rem] w-[3rem] modal-background border border-white flex items-center justify-center
                    opacity-0 custom-transition-duration-5s ${(hoverStatus && hoverItemIndex === res?.id) && "opacity-100" }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white" data-name="Play" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg>
                </div>
              </div>

              {/* Title, Overview and Runtime */}
              <div className="grow mr-10">
                <div className="flex justify-between gap-x-5">
                  <p className="text-white text-sm font-bold">{res?.name}</p>
                  <p className="text-white line-h mt-[-3px]">{res?.runtime && `${res?.runtime}m`}</p>
                </div>

                {/* Overview */}
                <p className="mt-2 text-sm text-[#d2d2d2]">
                  {res?.overview ? 
                    `${sentenceCutter(1, res?.overview).length <=10 ? sentenceCutter(2, res?.overview) : sentenceCutter(1, res?.overview)}` 
                    :
                    "No overview available."}
                </p>
              </div>
            </div>
          ))}

          {/* See more episodes if episodes length is more than 10 */
          (episodeData?.episodes?.length > 10 && !isLoadingEpisode) &&
            <div className="flex flex-col items-center justify-center ">
              <div className="w-full h-[.2rem] bg-[#424242]"></div>
              <div 
                className={`h-[2.5rem] w-[2.5rem] mt-[-1.30rem] bg-[#1d1d1db2] rounded-full border-[2px] 
                  border-[#919191] cursor-pointer flex items-center justify-center
                  transition-transform ${episodeSize > 10 ? "transform rotate-180" : ""}`}
                onClick={() => setEpisodeSize(episodeSize > 10 ? 10 : episodeData?.episodes?.length)}
              >
                <img src={down} alt="Add to my list" className="mt-[2px] w-5"/>
              </div>
            </div>
          }
        </div>
      }

      {/* Collection section */
      collectionData && !isLoadingCollection &&
        <div className="mt-6 w-full">
          <div className="flex items-center gap-x-3">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="title-group-collection ltr-4z3qvp e1svuwfo1 text-white mt-[1px]" data-name="Collection" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M2 3C0.895431 3 0 3.89543 0 5V19C0 20.1046 0.895431 21 2 21H22C23.1046 21 24 20.1046 24 19V5C24 3.89543 23.1046 3 22 3H2ZM2 5H22V19H2V5ZM5 7V17H7V7H5ZM9 17V7H11V17H9ZM13.0715 7.37139L17.0715 17.3714L18.9285 16.6286L14.9285 6.62861L13.0715 7.37139Z" fill="currentColor"></path></svg>
            <p className="text-white text-2xl font-bold">
              {showDetailsData?.belongs_to_collection?.name || "Show Collection"}
            </p>
          </div>

          <div className="mt-4 w-full grid gap-5 grid-cols-3">
          {// Items Data Mapping
           collectionData?.parts?.map((
              res : {
                id: number, 
                backdrop_path: string,
                title?: string,
                name?: string,
                original_title?: string,
                release_date?: string,
                last_air_date?: string,
                first_air_date?: string,
                overview: string
                season_number?: number
                episode_number?: number
                number_of_seasons?: number
              },
              index : number
            ) => (
              <div
                key={index} 
                className="rounded pb-6 bg-[#2f2f2f] cursor-pointer overflow-hidden"
                onMouseOver={() => hoverEpisodeItemCollection(res?.id)}
                onMouseOut={hoverOutEpisodeItemCollection}
                onClick={() => navigateToWatch(res?.number_of_seasons ? "tv" : "movie", res?.id, res?.season_number, res?.episode_number)}
              >
                {/* Poster */}
                <LazyLoadImage
                  alt="Show Image"
                  src={`${res?.backdrop_path && import.meta.env.VITE_BASE_IMAGE_URL}${res?.backdrop_path}`} 
                  className="w-full h-[7rem] 900size:h-[8.5rem]"
                  onError={handleImageError}
                />

                {/* Show name */}
                <div className="w-full h-[7rem] mt-[-7rem] 900size:h-[8.5rem] 900size:mt-[-8.5rem] relative z-10 bg-[#02020249] flex items-end">
                  <p className="text-white movie-title-font-large max-w-[80%] leading-tight text-base capitalize tracking-wide ml-4 mb-4 [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
                    {res?.title || res?.name || res?.original_title}
                  </p>
                </div> 

                {/* Play Icon */}
                <div className="w-full h-[7rem] mt-[-7rem] 900size:h-[8.5rem] 900size:mt-[-8.5rem] relative z-10 flex items-center justify-center">
                  <div 
                    className={`rounded-full h-[3rem] w-[3rem] modal-background border border-white flex items-center justify-center
                      opacity-0 custom-transition-duration-5s ${(hoverStatusCollection && hoverItemIndexCollection === res?.id) && "opacity-100" }`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white" data-name="Play" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg>
                  </div>
                </div>

                {/* Match, Age, Year and Add to my list button */}
                <div className="mt-4 mx-3 flex justify-between gap-x-2">
                  <div>
                    {/* Match Percentage */}
                    <p className="text-[#42c161] text-sm font-bold">{matchRandom1 && matchRandom1[index]}% Match</p>

                    <div className="flex items-center gap-x-2 mt-1">
                      {/* Age */}
                      <div className="text-[#bcbcbc] float-left text-sm px-[5px] border border-[#bcbcbc]">{ageRandom1 && ageRandom1[index]}+</div>
                      {/* Release Date */}
                      <p className="text-[#bcbcbc] font-medium ">
                        {new Date(res?.release_date || res?.last_air_date || res?.first_air_date || "2024-01-25").getFullYear()}
                      </p>
                    </div>
                  </div>

                  {/* Add to Mylist */}
                  <LightTooltip title="Add to My List" arrow sx={{'& .MuiTooltip-arrow': {color: '#ffff',},}}>
                    <div className="bg-[#232323] rounded-full h-11 w-11 flex items-center justify-center border-2 border-[#8b8b8b] cursor-pointer ">
                      <img src={add} alt="Play Icon" className="h-5"/>
                    </div>
                  </LightTooltip>
                </div>

                {/* Overview */}
                <p className="mt-4 text-sm text-[#d2d2d2] mx-3">
                  {res?.overview ? sentenceCutter(1, res?.overview).length <=10 ? sentenceCutter(2, res?.overview) : sentenceCutter(1, res?.overview) : "No overview available."}
                </p>
              </div>
            ))
          }
          </div>
        </div>
      }

      {/* More like this section */}
      <div className="mt-6 w-full">
        <p className="text-white text-2xl font-bold">More Like This</p>

        <div className="mt-4 w-full grid gap-5 grid-cols-3">
        {// Items Data Mapping
         (similarShowsData?.results.length !== 0 ? similarShowsData : trendingShowsData)?.results
         .filter((res: { id:  string }) => res.id !== showDetailsData?.id)
         .slice(0, similarShowSize)
         .map((
            res : {
              id: number, 
              backdrop_path: string,
              title?: string,
              name?: string,
              original_title?: string,
              release_date?: string,
              last_air_date?: string,
              first_air_date?: string,
              overview: string,
              media_type?: string
              season_number?: number
              episode_number?: number
            },
            index : number
          ) => (
            <div 
              key={index}
              className="rounded pb-6 bg-[#2f2f2f] cursor-pointer overflow-hidden"
              onMouseOver={() => hoverEpisodeItemLikeThis(res?.id)}
              onMouseOut={hoverOutEpisodeItemLikeThis}
              onClick={() => navigateToWatch(res?.media_type ? res?.media_type : "movie", res?.id, res?.season_number, res?.episode_number)}
            >
              {/* Poster */}
              <LazyLoadImage
                alt="Show Image"
                src={`${res?.backdrop_path && import.meta.env.VITE_BASE_IMAGE_URL}${res?.backdrop_path}`} 
                className="w-full h-[7rem] 900size:h-[8.5rem]"
                onError={handleImageError}
              />

              {/* Show name */}
              <div className="w-full h-[7rem] mt-[-7rem] 900size:h-[8.5rem] 900size:mt-[-8.5rem] relative z-10 bg-[#02020249] flex items-end">
                <p className="text-white movie-title-font-large max-w-[80%] leading-tight text-base capitalize tracking-wide ml-4 mb-4 [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
                  {res?.title || res?.name || res?.original_title}
                </p>
              </div> 

              {/* Play Icon */}
              <div className="w-full h-[7rem] mt-[-7rem] 900size:h-[8.5rem] 900size:mt-[-8.5rem] relative z-10 flex items-center justify-center">
                <div 
                  className={`rounded-full h-[3rem] w-[3rem] modal-background border border-white flex items-center justify-center
                    opacity-0 custom-transition-duration-5s ${(hoverStatusLikeThis && hoverItemIndexLikeThis === res?.id) && "opacity-100" }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white" data-name="Play" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg>
                </div>
              </div>

              {/* Match, Age, Year and Add to my list button */}
              <div className="mt-4 mx-3 flex justify-between gap-x-2">
                <div>
                  {/* Match Percentage */}
                  <p className="text-[#42c161] text-sm font-bold">{matchRandom2 && matchRandom2[index]}% Match</p>

                  <div className="flex items-center gap-x-2 mt-1">
                    {/* Age */}
                    <div className="text-[#bcbcbc] float-left text-sm px-[5px] border border-[#bcbcbc]">{ageRandom2 && ageRandom2[index]}+</div>
                    {/* Release Date */}
                    <p className="text-[#bcbcbc] font-medium ">
                      {new Date(res?.release_date || res?.last_air_date || res?.first_air_date || "2024-01-25").getFullYear()}
                    </p>
                  </div>
                </div>

                {/* Add to Mylist */}
                <LightTooltip title="Add to My List" arrow sx={{'& .MuiTooltip-arrow': {color: '#ffff',},}}>
                  <div className="bg-[#232323] rounded-full h-11 w-11 flex items-center justify-center border-2 border-[#8b8b8b] cursor-pointer ">
                    <img src={add} alt="Play Icon" className="h-5"/>
                  </div>
                </LightTooltip>
              </div>

              {/* Overview */}
              <p className="mt-4 text-sm text-[#d2d2d2] mx-3">
                {res?.overview ? sentenceCutter(1, res?.overview).length <=10 ? sentenceCutter(2, res?.overview) : sentenceCutter(1, res?.overview) : "No overview available."}
              </p>
            </div>
          ))
        }
        </div>

        {/* See more items if items length is more than 9 */
        (!isLoadingSimilarShows && !isLoadingTrendingShows) &&
        (
          (similarShowsData?.results?.length > 9) || 
          (similarShowsData?.results?.length === 0 && trendingShowsData?.results?.length > 9)
        ) &&
          <div className="flex flex-col items-center justify-center ">
            <div className="w-full h-[.2rem] bg-[#424242]"></div>
            <div 
              className={`h-[2.5rem] w-[2.5rem] mt-[-1.30rem] bg-[#1d1d1db2] rounded-full border-[2px] 
                border-[#919191] cursor-pointer flex items-center justify-center
                transition-transform ${similarShowSize > 10 ? "transform rotate-180" : ""}`}
              onClick={() => 
                setSimilarShowSize(
                  similarShowSize > 9 ? 9 
                  : 
                  similarShowsData?.results.length !== 0 ? 
                    similarShowsData?.results?.length : trendingShowsData?.results?.length
                )
              }
            >
              <img src={down} alt="Add to my list" className="mt-[2px] w-5"/>
            </div>
          </div>
        }
      </div>

      {/* About this item section */}
      <div className="mt-7 w-full ">
        <p className="mb-5 text-white text-2xl">About <span className="text-2xl font-bold tracking-wide">{showDetailsData?.title || showDetailsData?.name || showDetailsData?.original_title}</span></p>

        {/* Creators */
        showDetailsData && showDetailsData.created_by && showDetailsData.created_by.length !== 0 &&
          <p className="text-[#9b9b9b] text-sm">
            Creators:&nbsp;
            {// Creators mapping
            showDetailsData.created_by.map((res: { name: string }, index: number) => 
                <span className="text-sm text-white" key={index}>
                  {res?.name}{index < showDetailsData.created_by.length - 1 && ",\u00A0\u00A0"}
                </span>
              )
            }
          </p>
        }

        {/* Cast */
        castsData && castsData?.cast.length !== 0 &&
          <p className="text-[#9b9b9b] text-sm mt-[.50rem]">
            Cast:&nbsp;
            {// Creators mapping
              castsData.cast.map((res: { original_name: string }, index: number) => 
                <span className="text-sm text-white" key={index}>
                  {res?.original_name}{index < castsData.cast.length - 1 && ",\u00A0\u00A0"}
                </span>
              )
            }
          </p>
        }

        {/* Genres */}
        <p className="text-[#9b9b9b] text-sm mt-[.50rem]">
          Genres:&nbsp;
          {/* Cast Mapping */}
          {showDetailsData?.genres?.map((res: { name: string }, index: number, array: { name: string }[]) => 
            <span className="text-sm text-white" key={index}>
              {res?.name}{index < array.length - 1 ? ', ' : ''}
            </span>
          )}
        </p>

        {/* Tagline */}
        <p className="text-[#9b9b9b] text-sm mt-[.50rem]">Tagline: <span className="text-sm text-white">{showDetailsData?.tagline || "Not Available"}</span></p>

        {/* Maturity Rating */}
        <div className="flex items-center gap-x-3 mt-[.50rem]">
          <p className="text-[#9b9b9b] text-sm">Maturity rating:</p>
          <div className="text-white float-left text-sm px-[5px] border border-white">{age}+</div>
          <p className="text-white text-sm">Recommended for age {age} and up</p>
        </div>
      </div>
    </div>
  )
}
