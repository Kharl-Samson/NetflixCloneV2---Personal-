import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../../../store/ZustandStore"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import { useQuery } from "react-query"
import { getEpisodeDetails, getShowList, getSimilarShows } from "../../../../services/apiFetchShowList"
import down from "../../../../assets/images/icons/down.png"
import Skeleton from "@mui/material/Skeleton"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { handleImageError } from "../../../../types/errorTypes"
import { styled } from "@mui/material/styles"
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import add from "../../../../assets/images/icons/add.png"

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
  age : string
}

export const EpisodeLists = ({age} : EpisodeListsProps) => {
    // React Youtube State
    const { showDetails } = useAppStore()

    // Season dropdown controller
    const [selectedSeason, setSelectedSeason] = useState<number>(1)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const toggleSelect = () => setIsOpen(!isOpen)
    const handleSelect = (option: number) => {
      setSelectedSeason(option)
      setIsOpen(false)
    }

    // Closing dropwdown
    const dropDownRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => dropDownRef.current && !dropDownRef.current.contains(event.target as Node) && setIsOpen(false)
      window.addEventListener("mousedown", handleClickOutside)
      return () => window.removeEventListener("mousedown", handleClickOutside)
    }, [dropDownRef])

    // Fetch Episode Details
    const { data : episodeData, isLoading: isLoadingEpisode } = useQuery(
      ["episodeKey", selectedSeason],
      () => showDetails?.number_of_seasons && getEpisodeDetails(showDetails?.id, selectedSeason)
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

    // Sentece Cutter
    const sentenceCutter = (size: number, text: string): string => {
      const sentences = text.match(/[^.!?]+[.!?]+/g);
      return sentences ? sentences.slice(0, size).join(" ") : text;
    }

    // Fetch Similar Shows
    const { data : similarShowsData, isLoading: isLoadingSimilarShows } = useQuery(
      ["similarShowsKey", showDetails?.id],
      () => getSimilarShows(!showDetails?.number_of_seasons ? "movie" : "tv", showDetails?.id, 1)
    )

    // Fetch Trending tv show if similar Show is invalid
    const { data : trendingShowsData, isLoading: isLoadingTrendingShows } = useQuery(
      ["trendingNow1", showDetails?.id],
      () => getShowList(
        "Trending Now", // Query Type (ex. Hero, Romantic Movies, TV Action & Adventure, etc)
        "tv", // Category (ex. tv or movie)
        "en-US", // Language
        null, // Genre
        1 // Page Number
      )
    )

    // State for similar show list size to show in data
    const [similarShowSize, setSimilarShowSize] = useState<number>(9)

    // Random Array - [Match and Age]
    const matchArray : string[] = ["95", "96","97", "98"]
    const ageArray : string[] = ["10", "13", "16"]

    console.log(similarShowsData?.results.length)
  return (
    <div className="relative mt-10 px-14">

      {/*
        * If the item is TV Show
        * Episode Title and Season Identifier, dropdown 
        */
      showDetails?.number_of_seasons &&
        <div className="w-full flex justify-between items-start gap-x-10">
          <p className="text-white text-2xl font-semibold tracking-wide">Episodes</p>

          {showDetails?.number_of_seasons === 1 ?
            // If 1 Season only
            <p className="text-white text-xl">Season {showDetails?.number_of_seasons}</p>
            :
            // If more than 1 season
            <div className="relative w-[11rem] disable-highlight" ref={dropDownRef}>
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
                <div className="select-season absolute border border-[#424242] mt-[2px] bg-[#242424] w-[13rem] ml-[-2rem] z-10 max-h-[23rem] overflow-y-scroll">
                  {showDetails?.seasons.map((res : {season_number: number}, index: number) => (
                    res?.season_number !== 0 && (
                      <div
                        key={index}
                        className="text-white py-2 px-4 cursor-pointer hover:bg-[#424242]"
                        onClick={() => handleSelect(res?.season_number)}
                      >
                        Season {res?.season_number}
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
      showDetails?.number_of_seasons > 1 &&
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
      showDetails?.number_of_seasons &&
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
          episodeData?.episodes.slice(0, episodeSize).map((
            res : {
              id: number, 
              episode_number: number, 
              still_path: string,
              name: string,
              runtime: number,
              overview: string
            },
            index : number
          ) => (
            <div 
              key={res?.id}
              className="rounded w-full py-7 border-b border-[#424242] flex items-center gap-x-5 cursor-pointer" 
              onMouseOver={() => hoverEpisodeItem(res?.id)}
              onMouseOut={hoverOutEpisodeItem}
            >
              {/* Episode Number */}
              <p className="text-[#d2d2d2] text-2xl w-[3.4rem] min-w-[3.4rem] text-right">{index + 1}</p>

              {/* Poster */}
              <LazyLoadImage
                alt="Episode Banner Image"
                src={`${res?.still_path && import.meta.env.VITE_BASE_IMAGE_URL}${res?.still_path}`} 
                className="h-[4.8rem] w-[8.7rem] min-w-[8.7rem] rounded bg-[#131313]"
                onError={handleImageError}
              />
              {/* Play Icon */}
              <div className="h-[4.8rem] w-[8.7rem] ml-[-9.95rem] min-w-[8.7rem] flex items-center justify-center relative z-10">
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
                <p className="mt-2 text-sm text-[#d2d2d2]">{res?.overview ? `${sentenceCutter(1, res?.overview)}` : "No overview available."}</p>
              </div>
            </div>
          ))}

          {/* See more episodes if episodes length is more than 10 */
          (episodeData?.episodes?.length > 10 && !isLoadingEpisode) &&
            <div className="flex flex-col items-center justify-center disable-highlight">
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

      {/* More like this section */}
      <div className="mt-6 w-full">
        <p className="text-white text-2xl font-bold">More Like This</p>

        <div className="mt-4 w-full grid gap-5 grid-cols-3">
        {// Episode Data Mapping
         (similarShowsData?.results.length !== 0 ? similarShowsData : trendingShowsData)?.results
         .filter((res: { id:  number }) => res.id !== showDetails?.id)
         .slice(0, similarShowSize)
         .map((
            res : {
              id: number, 
              backdrop_path: string,
              name?: string,
              original_title?: string,
              release_date?: string,
              last_air_date?: string,
              first_air_date?: string,
              overview: string
            }
          ) => (
            <div className="rounded pb-6 bg-[#2f2f2f] cursor-pointer overflow-hidden" key={res?.id}>
              {/* Poster */}
              <LazyLoadImage
                alt="Show Image"
                src={`${res?.backdrop_path && import.meta.env.VITE_BASE_IMAGE_URL}${res?.backdrop_path}`} 
                className="w-full h-[8.5rem]"
                onError={handleImageError}
              />

              {/* Show name and Season count or Run Time */}
              <div className="w-full h-[8.5rem] mt-[-8.5rem] relative z-10 bg-[#02020249] flex items-end">
                {/* Item Name */}
                <p className="text-white movie-title-font-large max-w-[80%] leading-tight text-large capitalize tracking-wide ml-4 mb-4 [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
                  {res?.name || res?.original_title}
                </p>
              </div> 

              {/* Match, Age, Year and Add to my list button */}
              <div className="mt-4 mx-3 flex justify-between gap-x-2">
                <div>
                  {/* Match Percentage */}
                  <p className="text-[#42c161] text-sm font-bold">{matchArray[Math.floor(Math.random() * matchArray.length)]}% Match</p>

                  <div className="flex items-center gap-x-2 mt-1">
                    {/* Age */}
                    <div className="text-[#bcbcbc] float-left text-sm px-[5px] border border-[#bcbcbc]">{ageArray[Math.floor(Math.random() * ageArray.length)]}+</div>
                    {/* Release Date */}
                    <p className="text-[#bcbcbc] font-medium disable-highlight">
                      {new Date(res?.release_date || res?.last_air_date || res?.first_air_date || "N/A").getFullYear()}
                    </p>
                  </div>
                </div>

                {/* Add to Mylist */}
                <LightTooltip title="Add to My List" arrow sx={{'& .MuiTooltip-arrow': {color: '#ffff',},}}>
                  <div className="bg-[#232323] rounded-full h-11 w-11 flex items-center justify-center border-2 border-[#8b8b8b] cursor-pointer disable-highlight">
                    <img src={add} alt="Play Icon" className="h-5"/>
                  </div>
                </LightTooltip>
              </div>

              {/* Overview */}
              <p className="mt-4 text-sm text-[#d2d2d2] mx-3">{sentenceCutter(1, res?.overview)}</p>
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
          <div className="flex flex-col items-center justify-center disable-highlight">
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

    </div>
  )
}
