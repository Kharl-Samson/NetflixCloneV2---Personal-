import { useLayoutEffect, useState } from "react"
import "../youtubePlayer/YoutubePlayer.css"
import YouTube, { YouTubeProps } from "react-youtube"
import { useAppStore } from "../../store/ZustandStore"
import { videoEndedItems } from "../../utils/youtubeFunction"


export const YoutubePlayerItem = ( {
    id, videoId, duration, isFetchedTrailer
  } : YoutubePlayerTypes) => {

    const [video, setVideo] = useState<any>(undefined)

    // React Youtube State
    const { setShowVideoItems, setTriggerAnimItems, isMutedItems, playAgainItems, setPause } = useAppStore()

    // React Youtube Configuration
    const [videoValid, setVideoValid] = useState<boolean>(false)
    const onReady: YouTubeProps["onReady"] = (event) => {
      event.target.setPlaybackQuality("highres")
      setVideo(() => event.target)
      
      if(isFetchedTrailer && videoId && event.target.getVideoData().video_id && event.target.getVideoData().isPlayable) {
        setVideoValid(true)
        const timeOut1 = setTimeout(() => setShowVideoItems(true), duration)
        const timeOut2 = setTimeout(() => {
          setTriggerAnimItems(true)
          setPause(true)
        }, 100)
        return () => {
          clearTimeout(timeOut1)
          clearTimeout(timeOut2)
        }
      }
      else{
        setShowVideoItems(false)
        setVideoValid(false)
        const timeOut = setTimeout(() => {
          setTriggerAnimItems(true)
          setPause(true)
        }, 500)
        return () => timeOut
      }
    }

    // React Youtube Configuration
    const opts: YouTubeProps["opts"] = {
        playerVars: {
          autoplay: 1,
          mute: 1
      }
    }

    useLayoutEffect(() => {
      if(videoValid && video.g && video.g.src) {
        // Mute
        isMutedItems ? video.mute() : video.unMute()
        // Play Again
        playAgainItems && video.playVideo()
      }
    },[isMutedItems, playAgainItems])
  
  return (
    <YouTube  
      id = {id}
      videoId = {videoId}
      opts = {opts}
      onReady = {onReady}
      onEnd = {videoEndedItems}
    />
  )
}
