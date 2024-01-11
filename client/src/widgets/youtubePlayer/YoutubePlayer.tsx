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
    const [videoValid, setVideoValid] = useState<boolean>(false)
    const onReady: YouTubeProps["onReady"] = (event) => {
      event.target.setPlaybackQuality("highres")
      setVideo(() => event.target)
      if(isFetchedTrailer && videoId && event.target.getVideoData().video_id && event.target.getVideoData().isPlayable) {
        setVideoValid(true)
        const timeOut = setTimeout(() => setShowVideo(true), duration)
        return () => clearTimeout(timeOut)
      }
      else{
        setVideoValid(false)
      }

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
      videoValid && isMuted ? video?.mute() : video?.unMute()
      // Play Again
      videoValid && playAgain && video?.playVideo()
      // Pause
      videoValid && pause ? video?.pauseVideo() : video?.playVideo()
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
