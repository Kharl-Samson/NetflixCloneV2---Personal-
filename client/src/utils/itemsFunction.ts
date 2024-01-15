import { useMutation } from "react-query"
import { getShowDetails } from "../services/apiFetchShowList"
import { useAppStore } from "../store/ZustandStore"


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
 * When the user click the video sound button
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
 * Custom hook for item hover
 * Includes onMouseOver and onMouseOut
*/
type GetShowDetailsResponse = string
export const useHoverHandlers = () => {
    const { 
        showVideo, setShowVideoItems, setIsMutedItems, setPause, setTriggerAnimItems,
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
    const handleHover = (media_type: string, id: string) => {
      const timeOut = setTimeout(() => setShowVideo(false), 100)

      setCategory(media_type)
      setVideoId(id)
  
      mutation.mutate({
        category: media_type,
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
      setTrailerData("")
      setCategory("")
      setVideoId("")
      setIsMutedItems(true)
      showVideo && setPause(false)

      return () => clearTimeout(timeOut)
    }
  
    return { handleHover, handleHoverOut }
  }