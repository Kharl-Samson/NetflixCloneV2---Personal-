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

export const YoutubePlayer = ( {
    id, videoId, duration, isFetchedTrailer
  } : YoutubePlayerProps) => {

    const [video, setVideo] = useState<any>(undefined)

    // React Youtube State
    const { setShowVideo, isMuted, setVideoEnded, playAgain, setPlayAgain, pause } = useAppStore()

    // React Youtube Configuration
    const onReady: YouTubeProps["onReady"] = (event) => {
      setVideo(() => event.target)
      if(isFetchedTrailer && videoId && event.target.getVideoData().video_id && event.target.getVideoData().isPlayable) {
        const timeOut = setTimeout(() => setShowVideo(true), duration)
        return () => clearTimeout(timeOut)
      }
      event.target.setPlaybackQuality("highres")
    }

    const videoEnded = () => {
      setVideoEnded(true)
      setShowVideo(false)
      setPlayAgain(false)
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
      isMuted ? video?.mute() : video?.unMute()
      // Play Again
      playAgain && video?.playVideo()
      // Pause
      pause ? video?.pauseVideo() : video?.playVideo()
    },[isMuted, playAgain, pause])
  
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
