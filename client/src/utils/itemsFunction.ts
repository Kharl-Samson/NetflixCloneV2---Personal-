import { useMutation } from "react-query"
import { getShowDetails } from "../services/apiFetchShowList"
import { useAppStore } from "../store/ZustandStore"
import { useNavigate, useParams, useLocation, Location } from "react-router-dom"
import { ItemType } from "../types/itemTypes"

/*
 * When the user swipe the slider to left
 * Used ts-ignore because of predefined element
*/
export const swipeLeft = (classCount : number) => {
    // @ts-ignore
    document.getElementsByClassName("swiper-button-prev")[classCount].click()
}

/*
 * When the user swipe the slider to right
 * Used ts-ignore because of predefined element
*/
export const swipeRight = (classCount : number) => {
    // @ts-ignore
    document.getElementsByClassName("swiper-button-next")[classCount].click()
}

/*
 * Function inside useEfect
 * Setting the active trailer data
*/
export const dataInEffect = (myTrailerData : {results : {name: string, key: string}[]} ) => {
    const { setTrailerData } = useAppStore.getState()
    setTrailerData("")
    
    if(myTrailerData?.results){
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
    else{
      setTrailerData("")
    }
}

/*
 * When the user click the video sound button - Items
*/
export const toggleVideoSound = () => {
  const { setPlayAgainItems, setIsMutedItems, isMutedItems, videoEndedItems, setVideoEndedItems, setShowVideoItems } = useAppStore.getState()

  setPlayAgainItems(false)
  setIsMutedItems(!isMutedItems)
  
  if(videoEndedItems) {
    setVideoEndedItems(false)
    setShowVideoItems(true)
    setIsMutedItems(true)
    setPlayAgainItems(true)
  }
}

/*
 * When the user click the video sound button - Modal
*/
export const toggleVideoSoundModal = () => {
  const { setPlayAgainModal, setIsMutedModal, isMutedModal, videoEndedModal, setVideoEndedModal, setShowVideoModal } = useAppStore.getState()

  setPlayAgainModal(false)
  setIsMutedModal(!isMutedModal)
  
  if(videoEndedModal) {
    setVideoEndedModal(false)
    setShowVideoModal(true)
    setIsMutedModal(true)
    setPlayAgainModal(true)
  }
}

/*
 * When the user click the video sound button - Phone
*/
export const toggleVideoSoundPhone = () => {
  const { setPlayAgainPhone, setIsMutedPhone, isMutedPhone, videoEndedPhone, setVideoEndedPhone, setShowVideoPhone } = useAppStore.getState()

  setPlayAgainPhone(false)
  setIsMutedPhone(!isMutedPhone)
  
  if(videoEndedPhone) {
    setVideoEndedPhone(false)
    setShowVideoPhone(true)
    setIsMutedPhone(true)
    setPlayAgainPhone(true)
  }
}

/*
 * Custom hook for item hover
 * Includes onMouseOver and onMouseOut
*/
export const useHoverHandlers = () => {
    const { 
        setShowVideoItems, setIsMutedItems, setPause, setTriggerAnimItems, setTrailerData,
        setVideoId, setShowDetails, setShowVideo, setVideoEndedItems
    } = useAppStore.getState()

    // fetch show details when hover
    const mutation = useMutation<String, Error, { category: string, trailerId: string | number, language?: string }>(
      ({ category, trailerId, language }) => getShowDetails(category, trailerId, language),
      {
        onSuccess: (res) => {
          setShowDetails(res)
        }
      }
    )

    // Hover Show
    const handleHover = (media_type: string | boolean, id: string) => {
      // Get search value params
      const urlParams = new URLSearchParams(window.location.search)
      const searchParams = urlParams.get("search")

      const timeOut = setTimeout(() => {
        searchParams !== "1" && setPause(true)
        searchParams !== "1" && setShowVideo(false)
      }, 100)
      setVideoId(id)
  
      mutation.mutate({
        category: media_type.toString(),
        trailerId: id,
        language: "en-US"
      })

      return () => clearTimeout(timeOut)
    }
  
    // Remove hover on show
    const handleHoverOut = () => {
      const { showVideo, currentSection, showDetailsModal } = useAppStore.getState()

      // Get search value params
      const urlParams = new URLSearchParams(window.location.search)
      const searchParams = urlParams.get("search")

      const timeOut = setTimeout(() => {
        (!showDetailsModal && currentSection !== "categorySection" && searchParams !== "1") && setShowVideo(true); 
        (!showDetailsModal && currentSection !== "categorySection" && searchParams !== "1") && setPause(false);
      }, 100)
      setTriggerAnimItems(false)

      setShowDetails("")
      setShowVideoItems(false)
      setTrailerData("")
      setVideoId("")

      setVideoEndedItems(false)
      setIsMutedItems(true);
      (!showDetailsModal && showVideo && searchParams !== "1") && setPause(false);
      
      return () => clearTimeout(timeOut)
    }
  
    return { handleHover, handleHoverOut }
  }

/*
 * Custom hook for item click
 * Includes onClick and onClose
*/
export const useClickHandlers = () => {
    // Navigate
    const navigate = useNavigate()

    // Zustand State
    const { setShowDetailsModal, showDetailsModal} = useAppStore.getState()

    // Click Show
    const handleClickModal = (event: React.MouseEvent<HTMLElement, MouseEvent> , media_type: string | boolean, id: string) => {
      if (!((event.target as HTMLElement).id.includes("notValidModal"))) {
        // Zustand States
        const { setPause, setShowVideoModal, setVideoId, setShowDetailsModal, setShowVideo} = useAppStore.getState()

        // Get search value params
        const urlParams = new URLSearchParams(window.location.search)
        const searchParams = urlParams.get("search")
        const sParam = urlParams.get("s")

        setShowVideoModal(false)
        setShowDetailsModal(true)
        searchParams !== "1" && setShowVideo(false)
        searchParams !== "1" && setPause(true)

        searchParams === "1" ? navigate(`/browse/${media_type}?search=1&s=${sParam}&q=${id}`) : navigate(`/browse/${media_type}?q=${id}`)
        
        setVideoId(id)
      }
    }
  
    // Close Show
    const handleCloseModalOut = () => {
      // Zustand States
      const { 
        setShowVideoItems, setIsMutedItems, setPause, setTriggerAnimItems, setShowVideoModal, currentSection,
        setTrailerData, setVideoId, setShowDetails, setShowVideo
      } = useAppStore.getState()

      // Get search value params
      const urlParams = new URLSearchParams(window.location.search)
      const searchParams = urlParams.get("search")
      const sParam = urlParams.get("s")

      searchParams === "1" ? navigate(`/?search=1&s=${sParam}`) : navigate("/")

      document.title = "Netflix Clone by Kharl"
      const body = document.body
      body.style.overflowY = "scroll"

      setShowDetails("")
      setShowVideoModal(false)
      searchParams !== "1" && setShowVideo(true)
      setShowDetailsModal(false)
      setTriggerAnimItems(false)

      setShowVideoItems(false)
      setTrailerData("")
      setVideoId("")
      setIsMutedItems(true);

      (searchParams !== "1" && !showDetailsModal && currentSection !== "categorySection") && setPause(false);
    }
  
    return { handleClickModal, handleCloseModalOut }
}

/*
 * Function for smaller device
 * Closing selected item and Navigate to Home
*/
export const handleCloseItemPhone = () => {
    const { setShowVideoPhone, setIsMutedPhone, setTrailerData, setVideoId } = useAppStore.getState()

    document.title = "Netflix Clone by Kharl"

    setShowVideoPhone(false)
    setIsMutedPhone(true)
    setTrailerData("")
    setVideoId("")
}

/*
 * Getting Parameters in my url
 * Category and Item ID
*/
type RouteAndQueryParams = {
  params: string
  categoryParams: string
}
export function getRouteAndQueryParams(location: Location, categoryParam: { category?: string }): RouteAndQueryParams {
  // Extract query parameter
  const queryParams = new URLSearchParams(location.search);
  const params = queryParams.get('q') || "Default"

  // Extract route parameter
  const categoryParams = categoryParam.category || ""

  return { params, categoryParams }
}

/*
 * Custom hook for getRouteAndQueryParams
 * return category and item ID
*/
export function useRouteAndQueryParams(): RouteAndQueryParams {
  const location = useLocation()
  const params = useParams<{ category?: string }>()
  return getRouteAndQueryParams(location, params)
}

/*
 * To shuffle arrays
 * Shuffle tv shows and movie
*/
export const shuffleArray = (array: ItemType[] ) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray
}