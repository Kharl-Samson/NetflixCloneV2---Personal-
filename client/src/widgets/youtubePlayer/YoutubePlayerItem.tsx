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
    const { setShowVideoItems, isMutedItems, setVideoEndedItems, playAgainItems, setPlayAgainItems } = useAppStore()

    // React Youtube Configuration
    const onReady: YouTubeProps["onReady"] = (event) => {
      setVideo(() => event.target)
      if(isFetchedTrailer && videoId && event.target.getVideoData().video_id && event.target.getVideoData().isPlayable) {
        const timeOut = setTimeout(() => setShowVideoItems(true), duration)
        return () => clearTimeout(timeOut)
      }
      event.target.setPlaybackQuality("highres")
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
      isMutedItems ? video?.mute() : video?.unMute()
      // Play Again
      playAgainItems && video?.playVideo()
      // Pause
      // if(pauseVideo)  video?.pauseVideo()
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
