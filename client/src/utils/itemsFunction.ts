import { useMutation } from "react-query"
import { getShowDetails } from "../services/apiFetchShowList"
import { useAppStore } from "../store/ZustandStore"


// Swiper Controllers ----------------------------------------------------------------------------------------
export const swipeLeft = (classCount : number) => {
    // @ts-ignore
    document.getElementsByClassName("swiper-button-prev")[classCount].click()
}

export const swipeRight = (classCount : number) => {
    // @ts-ignore
    document.getElementsByClassName("swiper-button-next")[classCount].click()
}

// Item UseEffect Function ------------------------------------------------------------------------------------------
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

// Video Sound Controller -------------------------------------------------------------------------------------------
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


// Item Hovers Hook ------------------------------------------------------------------------------------------
type GetShowDetailsResponse = string
export const useHoverHandlers = () => {
    const { 
        showVideo, setShowVideoItems, setIsMutedItems, setPause, setTriggerAnimItems,
        setTrailerData, setCategory, setVideoId, setShowDetails
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
      setCategory(media_type)
      setVideoId(id)
  
      mutation.mutate({
        category: media_type,
        trailerId: id,
        language: "en-US"
      })
    }
  
    // Remove hover on show
    const handleHoverOut = () => {
      setTriggerAnimItems(false)

      setShowVideoItems(false)
      setTrailerData("")
      setCategory("")
      setVideoId("")
      setIsMutedItems(true)
      showVideo && setPause(false)
    }
  
    return { handleHover, handleHoverOut }
  }