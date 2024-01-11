import { useEffect, useState } from "react"
import "../youtubePlayer/YoutubePlayer.css"
import YouTube, { YouTubeProps } from "react-youtube"
import { useAppStore } from "../../store/ZustandStore"

type YoutubePlayerProps = {
    id : string
    videoId : string
    duration : number
    isFetchedTrailer? : boolean
}

export const YoutubePlayerItem = ( {
    id, videoId, duration, isFetchedTrailer
  } : YoutubePlayerProps) => {

    const [video, setVideo] = useState<any>(undefined)

    // React Youtube State
    const { setShowVideoItems, setTriggerAnimItems, isMutedItems, setVideoEndedItems, playAgainItems, setPlayAgainItems, setPause } = useAppStore()

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
        setVideoValid(false)
        const timeOut = setTimeout(() => {
          setTriggerAnimItems(true)
          setPause(true)
        }, 500)
        return () => timeOut
      }
    }

    const videoEnded = () => {
      setVideoEndedItems(true)
      setShowVideoItems(false)
      setPlayAgainItems(false)
    }

    // React Youtube Configuration
    const opts: YouTubeProps["opts"] = {
        playerVars: {
          autoplay: 1,
          mute: 1
      }
    }

    useEffect(() => {
      // Mute
      videoValid && isMutedItems ? video?.mute() : video?.unMute()
      // Play Again
      videoValid && playAgainItems && video?.playVideo()
    },[isMutedItems, playAgainItems])
  
  return (
    <YouTube  
      id = {id}
      videoId = {videoId}
      opts = {opts}
      onReady = {onReady}
      onEnd = {videoEnded}
    />
  )
}
