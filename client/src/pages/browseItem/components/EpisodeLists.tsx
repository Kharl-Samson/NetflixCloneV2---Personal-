import { useEffect, useState } from "react"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import InfoIcon from "@mui/icons-material/Info"
import { getCollections, getEpisodeDetails, getShowList, getSimilarShows } from "../../../services/apiFetchShowList"
import { useQuery } from "react-query"
import Skeleton from "@mui/material/Skeleton"
import { handleImageError } from "../../../types/errorTypes"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { useRouteAndQueryParams } from "../../../utils/itemsFunction"

type EpisodeListsProps = {
    showDetailsData : {
        name? : string
        original_title? : string
        id : string
        number_of_seasons : number
        seasons : {
          season_number : number
        }[]
        belongs_to_collection? : {
            id : string
        }
    }
}

export const EpisodeLists = ({showDetailsData} : EpisodeListsProps) => {
    // Params Url Getter
    const { params, categoryParams } = useRouteAndQueryParams()

    // Season modal Controller
    const [seasonModalStatus, setSeasonModalStatus] = useState<boolean>(false)

    // Season dropdown controller
    const [selectedSeason, setSelectedSeason] = useState<number>(1)
    const handleSelect = (seasonNumber : number) =>{
        setSelectedSeason(seasonNumber)
        const timeOut = setTimeout(() => setSeasonModalStatus(false), 500)
        return () => clearTimeout(timeOut)
    }

    // More info modal Controller
    const [moreInfoModalStatus, setMoreInfoModalStatus] = useState<boolean>(false)

    // Random Array - [Match and Age]
    const ageArray : string[] = ["10", "13", "16"]
    const [age, setAge] = useState<string>("")
    useEffect(() => {
      const randomAge = Math.floor(Math.random() * ageArray.length)
      setAge(ageArray[randomAge])
    },[])

    // Fetch Episode Details
    const { data : episodeData, isLoading: isLoadingEpisode } = useQuery(
        ["episodeKey", selectedSeason],
        () => showDetailsData?.number_of_seasons && getEpisodeDetails(showDetailsData?.id, selectedSeason)
    )

    // Sentece Cutter
    const sentenceCutter = (size: number, text: string): string => {
        const sentences = text.match(/[^.!?]+[.!?]+/g);
        return sentences ? sentences.slice(0, size).join(" ") : text;
    }

    // Fetch Collections Show
    const { data : collectionData, isLoading: isLoadingCollection } = useQuery(
        ["collectionKey", params, categoryParams],
        () => showDetailsData && showDetailsData.belongs_to_collection && getCollections(showDetailsData?.belongs_to_collection?.id)
    )

    // Fetch Similar Shows
    const { data : similarShowsData, isLoading: isLoadingSimilarShows } = useQuery(
        ["similarShowsKey", params],
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

    // Tab Controller
    const [currentTab, setCurrentTab] = useState<string>(categoryParams === "tv" ? "Episodes" : "More Like This")
    useEffect(() => {
        if (!isLoadingSimilarShows && !isLoadingTrendingShows && !isLoadingCollection) {
            let newTab = ""
            if (showDetailsData?.number_of_seasons) {
                newTab = "Episodes"
            } else if (collectionData) {
                newTab = "Collection"
            } else if (similarShowsData) { 
                newTab = "More Like This"
            } else {
                categoryParams === "tv" ? newTab = "Episodes" : newTab = "More Like This"
            }
            setCurrentTab(newTab)
        }
    }, [isLoadingSimilarShows, isLoadingTrendingShows, isLoadingCollection, similarShowsData, showDetailsData, collectionData, episodeData, params])

  return (
    <div className="mx-2 mt-7">
        {/* Tab */}
        <div className="w-fulle flex items-center gap-x-4">
            { // Show only if the item is TV Show
            showDetailsData?.number_of_seasons &&
                <div onClick={() => setCurrentTab("Episodes")}>
                    <div className={`custom-transition-duration-3s h-[4px] bg-[#d60c14] ${currentTab === "Episodes" ? "w-[100%]" : "w-[0]"}`}></div>
                    <p className={`mt-2 text-sm font-bold ${currentTab === "Episodes" ? "text-white" : "text-[#9b9b9b]"}`}>Episodes</p>
                </div>
            }

            { // Show only if the item has a Collection
            collectionData &&
                <div onClick={() => setCurrentTab("Collection")}>
                    <div className={`custom-transition-duration-3s h-[4px] bg-[#d60c14] ${currentTab === "Collection" ? "w-[100%]" : "w-[0]"}`}></div>
                    <p className={`mt-2 text-sm font-bold ${currentTab === "Collection" ? "text-white" : "text-[#9b9b9b]"}`}>Collection</p>
                </div>
            }
            <div onClick={() => setCurrentTab("More Like This")}>
                <div className={`custom-transition-duration-3s h-[4px] bg-[#d60c14] ${currentTab === "More Like This" ? "w-[100%]" : "w-[0]"}`}></div>
                <p className={`mt-2 text-sm font-bold ${currentTab === "More Like This" ? "text-white" : "text-[#9b9b9b]"}`}>More Like This</p>
            </div>
        </div>

        {/* If currentTab value is "Episodes" and the category is TV Show */
        (currentTab === "Episodes" && showDetailsData?.number_of_seasons) ?
        <div className="mt-5 w-full">
            {/* Season dropdown and more info 
              * Show only if the item is TV Show */
            showDetailsData?.number_of_seasons &&
            <div className="flex items-center justify-between gap-x-2">
                { // Show dropdown season if number_of_seasons is more than 1
                showDetailsData?.number_of_seasons === 1 ?
                    <p className="text-sm text-[#9b9b9b]">Season {selectedSeason}</p>
                :
                    <p className="flex items-center text-sm text-[#9b9b9b]" onClick={() => setSeasonModalStatus(true)}>Season {selectedSeason}<KeyboardArrowDownIcon/></p>    
                }

                {/* Season dropdown modal */}
                <div 
                  className={`custom-transition-duration-3s h-[100dvh] w-full fixed left-0 rounded-t-[10px] z-20
                  modal-glassmorphism flex flex-col ${seasonModalStatus ? "top-[.20rem]" : "top-[100vh]"}`}
                >
                    <div className="flex-grow mt-14 overflow-y-scroll mb-5">
                        {showDetailsData?.seasons?.map((res : {season_number: number}, index: number) => (
                            res?.season_number !== 0 && (
                              <p
                                key={index}
                                className={`text-[#9b9b9b] text-center my-3 ${res?.season_number === selectedSeason && "text-white text-xl"}`}
                                onClick={() => handleSelect(res?.season_number)}
                              >
                                Season {res?.season_number}
                              </p>
                        )))}
                    </div>

                    {/* Close */}
                    <div className="bg-white h-[2.5rem] w-[2.5rem] rounded-full mb-10 mx-auto flex items-center justify-center" onClick={() => setSeasonModalStatus(false)}>
                      <p className="text-3xl mt-[-2px]">&#215;</p>
                    </div>
                </div>

                <InfoIcon sx={{color:"#9b9b9b", fontSize:"1.7rem"}} onClick={() => setMoreInfoModalStatus(true)}/>

                {/* More info modal */}
                <div 
                  className={`custom-transition-duration-3s h-[100dvh] w-full fixed left-0 rounded-t-[10px] z-20
                  bg-[#242424] flex flex-col ${moreInfoModalStatus ? "top-[.20rem]" : "top-[100vh]"}`}
                >
                    {/* Close */}
                    <div 
                        className="bg-[#3f3f3f] h-[2rem] w-[2rem] rounded-full flex items-center justify-center text-white ml-auto mt-2 mr-2" 
                        onClick={() => setMoreInfoModalStatus(false)}
                    >
                      <p className="text-2xl mt-[-1px]">&#215;</p>
                    </div>
                    {/* Title */}
                    <p className="text-white text-xl font-bold text-center mt-[-1.50rem] mx-auto max-w-[75%]">{showDetailsData?.name || showDetailsData?.original_title}</p>
                    {/* Season Number */}
                    <p className="mt-4 text-center mx-auto text-white">Season {selectedSeason}</p>
                    {/* Maturity Rating */}
                    <p className="text-center mx-auto text-white font-bold mt-4">Maturity Rating</p>
                    <div className="text-[#bcbcbc] mx-auto mt-4 w-[2rem] text-xs px-[5px] bg-[#464646] rounded-[2px]">{age}+</div>
                </div>
            </div>
            }

            {/* If the item is TV Show 
              * Episodes lists section */
            showDetailsData?.number_of_seasons &&
            <div className="mt-2 w-full">
                {// If data is loading
                isLoadingEpisode ?
                  <div className="flex flex-col gap-y-2">
                    {Array.from({ length: 5 }, (_, index) => (
                        <Skeleton variant="rounded" animation="wave" width={"100%"} height={"6rem"} key={index}/>
                    ))}
                  </div>
                :
                // Episode Data Mapping
                episodeData?.episodes?.map((
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
                    <div className="w-full mb-5" key={res?.id}>    
                        <div className="flex items-center gap-x-2">
                            {/* Poster */}
                            <LazyLoadImage
                              alt="Episode Banner Image"
                              src={`${res?.still_path && import.meta.env.VITE_BASE_IMAGE_URL}${res?.still_path}`} 
                              className="h-[4rem] w-[6.7rem] min-w-[6.7rem] rounded-lg bg-[#131313]"
                              onError={handleImageError}
                            />
                            {/* Play Icon */}
                            <div className="h-[4rem] w-[6.7rem] min-w-[6.7rem] ml-[-7.2rem] flex items-center justify-center relative z-10">
                              <div className="rounded-full h-[1.9rem] w-[1.9rem] bg-[#000000de] border border-white flex items-center justify-center">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white" data-name="Play" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg>
                              </div>
                            </div>

                            {/* Title and Runtime */}
                            <div className="w-full">
                              <p className="text-[#f3f3f3] text-sm">{index + 1}.&nbsp;{res?.name}</p>
                              <p className="text-[#9b9b9b] text-sm">{res?.runtime && `${res?.runtime}m`}</p>
                            </div>
                        </div>

                        {/* Overview */}
                        <p className="mt-2 text-sm text-[#d2d2d2]">
                          {res?.overview ? 
                            `${sentenceCutter(1, res?.overview).length <=10 ? sentenceCutter(2, res?.overview) : sentenceCutter(1, res?.overview)}` 
                            :
                            "No overview available."}
                        </p>
                    </div>
                ))}   
            </div>
            }
        </div>
        :
        /* if currentTab valuse is "Collection" */
        currentTab === "Collection" ?
            <div className="mt-4 mb-6 w-full grid gap-3 grid-cols-3">
                {isLoadingCollection ?
                    Array.from({ length: 6 }, (_, index) => (
                        <Skeleton variant="rounded" animation="wave" width={"100%"} height={"11rem"} key={index}/>
                    ))
                :
                // Episode Data Mapping
                collectionData?.parts?.map((
                    res : {
                      id: number, 
                      poster_path: string,
                      name?: string,
                      original_title?: string,
                      release_date?: string,
                      last_air_date?: string,
                      first_air_date?: string,
                      overview: string
                    }
                  ) => (
                    // Item Poster
                    <LazyLoadImage
                      key={res?.id}
                      alt="Show Image"
                      src={`${res?.poster_path && import.meta.env.VITE_BASE_IMAGE_URL}${res?.poster_path}`} 
                      className="w-full h-[11rem] rounded"
                      onError={handleImageError}
                    />
                  ))
                }
            </div>
        :
        /* If currentTab value is "More Like This" */
        <div className="mt-4 mb-6 w-full grid gap-3 grid-cols-3">
            {(isLoadingSimilarShows && isLoadingTrendingShows) ?
                Array.from({ length: 6 }, (_, index) => (
                    <Skeleton variant="rounded" animation="wave" width={"100%"} height={"11rem"} key={index}/>
                ))
            :
            // Episode Data Mapping
             (similarShowsData?.results.length !== 0 ? similarShowsData : trendingShowsData)?.results
             .filter((res: { id:  string }) => res.id !== showDetailsData?.id)
             .slice(0, 6)
             .map((
                res : {
                  id: number, 
                  poster_path: string,
                  name?: string,
                  original_title?: string,
                  release_date?: string,
                  last_air_date?: string,
                  first_air_date?: string,
                  overview: string
                }
              ) => (
                // Item Poster
                <LazyLoadImage
                  key={res?.id}
                  alt="Show Image"
                  src={`${res?.poster_path && import.meta.env.VITE_BASE_IMAGE_URL}${res?.poster_path}`} 
                  className="w-full h-[11rem] rounded"
                  onError={handleImageError}
                />
              ))
            }
        </div>
        }
    </div>
  )
}
