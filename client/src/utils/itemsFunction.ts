import { useMutation } from "react-query"
import { getShowDetails } from "../services/apiFetchShowList"
import { useAppStore } from "../store/ZustandStore"
import { useNavigate, useParams, useLocation, Location } from "react-router-dom"

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
type GetShowDetailsResponse = string
export const useHoverHandlers = () => {
    const { 
        showVideo, setShowVideoItems, setIsMutedItems, setPause, setTriggerAnimItems, setTrailerData,
        setVideoId, setShowDetails, setShowVideo, currentSection, showDetailsModal, setVideoEndedItems
    } = useAppStore.getState()

    // fetch show details when hover
    const mutation = useMutation<GetShowDetailsResponse, Error, { category: string, trailerId: string | number, language?: string }>(
      ({ category, trailerId, language }) => getShowDetails(category, trailerId, language),
      {
        onSuccess: (res) => {
          setShowDetails(res)
        }
      }
    )
  
    // Hover Show
    const handleHover = (media_type: string | boolean, id: string) => {
      const timeOut = setTimeout(() => {
        setPause(true)
        setShowVideo(false)
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
      const timeOut = setTimeout(() => {
        (!showDetailsModal && currentSection !== "categorySection") && setShowVideo(true); 
        (!showDetailsModal && currentSection !== "categorySection") && setPause(false);
      }, 100)
      setTriggerAnimItems(false)

      setShowDetails("")
      setShowVideoItems(false)
      setTrailerData("")
      setVideoId("")

      setVideoEndedItems(false)
      setIsMutedItems(true);
      (!showDetailsModal && showVideo) && setPause(false);
      
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

    const { 
        setShowVideoItems, setIsMutedItems, setPause, setTriggerAnimItems, setShowVideoModal, currentSection,
        setTrailerData, setVideoId, setShowDetails, setShowDetailsModal, setShowVideo, showDetailsModal
    } = useAppStore.getState()

    // Click Show
    const handleClickModal = (event: React.MouseEvent<HTMLElement, MouseEvent> , media_type: string | boolean, id: string) => {
      if (!((event.target as HTMLElement).id.includes("notValidModal"))) {
        setShowVideoModal(false)
        setShowDetailsModal(true)
        setShowVideo(false)
        setPause(true)

        navigate(`/browse/${media_type}?q=${id}`)
        
        setVideoId(id)
      }
    }
  
    // Close Show
    const handleCloseModalOut = () => {
      navigate("/")

      document.title = "Netflix Clone by Kharl"
      const body = document.body
      body.style.overflowY = "scroll"

      setShowDetails("")
      setShowVideoModal(false)
      setShowVideo(true)
      setShowDetailsModal(false)
      setTriggerAnimItems(false)

      setShowVideoItems(false)
      setTrailerData("")
      setVideoId("")
      setIsMutedItems(true);
      (!showDetailsModal && currentSection !== "categorySection") && setPause(false);
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