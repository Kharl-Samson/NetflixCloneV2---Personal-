import { useMutation } from "react-query"
import { getShowDetails } from "../services/apiFetchShowList"
import { useAppStore } from "../store/ZustandStore"
import { useLocation, useNavigate } from "react-router-dom"


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
 * Custom hook for item hover
 * Includes onMouseOver and onMouseOut
*/
type GetShowDetailsResponse = string
export const useHoverHandlers = () => {
    const { 
        showVideo, setShowVideoItems, setIsMutedItems, setPause, setTriggerAnimItems, showVideoModal,
        setTrailerData, setCategory, setVideoId, setShowDetails, setShowVideo, currentSection
    } = useAppStore.getState()

    // fetch show details when hover
    const mutation = useMutation<GetShowDetailsResponse, Error, { category: string, trailerId: string | number, language?: string }>(
      ({ category, trailerId, language }) => getShowDetails(category, trailerId, language),
      {
        onSuccess: (res) => {
          setShowDetails(res)
        },
        onError: (error) => {
          console.log(error)
        }
      }
    )
  
    // Hover Show
    const handleHover = (media_type: string | boolean, id: string) => {
      const timeOut = setTimeout(() => setShowVideo(false), 100)
      setCategory(media_type.toString())
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
        setShowVideo(true)
        currentSection !== "categorySection" && setPause(false)
      }, 100)

      setTriggerAnimItems(false)

      setShowVideoItems(false)
      showVideoModal && setTrailerData("")
      setCategory("")
      setVideoId("")
      setIsMutedItems(true)
      showVideo && setPause(false)

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
    const location = useLocation()
    const currentRoute = location.pathname
      
    const { 
        setShowVideoItems, setIsMutedItems, setPause, setTriggerAnimItems, setShowVideoModal,
        setTrailerData, setCategory, setVideoId, setShowDetails, setShowDetailsModal, setShowVideo
    } = useAppStore.getState()

    // fetch show details when hover
    const mutation = useMutation<GetShowDetailsResponse, Error, { category: string, trailerId: string | number, language?: string }>(
      ({ category, trailerId, language }) => getShowDetails(category, trailerId, language),
      {
        onSuccess: (res) => {
          setShowDetails(res)
        },
        onError: (error) => {
          console.log(error)
        }
      }
    )

    // Click Show
    const handleClickModal = (event: React.MouseEvent, media_type: string | boolean, id: string) => {

      const clickedElement = event.target as HTMLElement
      // Check if the clicked element is the desired element or a descendant of it
      const isClickedWithinElement1 = clickedElement.id === 'notValidModal1' || clickedElement.closest('#notValidModal1') !== null
      const isClickedWithinElement2 = clickedElement.id === 'notValidModal5' || clickedElement.closest('#notValidModal5') !== null
      
      if((!isClickedWithinElement1) && (!isClickedWithinElement2)){
        navigate(`${currentRoute}?q=${id}`)
        setShowDetailsModal(true)

        const body = document.body;
        body.style.overflowY = "hidden"

        setPause(true)
        setCategory(media_type.toString())
        setVideoId(id)
        
        mutation.mutate({
          category: media_type.toString(),
          trailerId: id,
          language: "en-US"
        })
      }
    }
  
    // Close Show
    const handleCloseModalOut = () => {
      navigate(currentRoute)

      const body = document.body
      body.style.overflowY = "scroll"

      setShowVideoModal(false)
      setShowVideo(true)
      setShowDetailsModal(false)
      setTriggerAnimItems(false)

      setShowVideoItems(false)
      setTrailerData("")
      setCategory("")
      setVideoId("")
      setIsMutedItems(true)
      setPause(false)
    }
  
    return { handleClickModal, handleCloseModalOut }
  }