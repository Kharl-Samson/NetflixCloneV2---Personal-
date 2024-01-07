import { useEffect, useState } from "react"
import "../youtubePlayer/YoutubePlayer.css"
import YouTube, { YouTubeProps } from "react-youtube"

type YoutubePlayerProps = {
    id : string
    videoId : string
    duration : number
    setShowVideoFalse? : () => void 
    setShowVideoTrue? :  () => void 
    setVideoEnded? : () => void
    setPlayAgainFalse : () => void
    playAgain : boolean
    isFetchedTrailer? : boolean
    isMuted? : boolean
}

export const YoutubePlayer = ( {
    id, videoId, duration, 
    setShowVideoFalse, setShowVideoTrue, 
    setVideoEnded, 
    setPlayAgainFalse, playAgain,
    isFetchedTrailer, isMuted
  } : YoutubePlayerProps) => {

    const [video, setVideo] = useState<any>(undefined)

    // React Youtube Configuration
    const onReady: YouTubeProps["onReady"] = (event) => {
      setVideo(() => event.target)
      if(isFetchedTrailer && videoId && event.target.getVideoData().video_id && event.target.getVideoData().isPlayable) {
        const timeOut = setTimeout(() => setShowVideoTrue && setShowVideoTrue(), duration)
        return () => clearTimeout(timeOut)
      }
      event.target.setPlaybackQuality("highres")
    }

    const videoEnded = () => {
      setVideoEnded && setVideoEnded()
      setShowVideoFalse && setShowVideoFalse()
      setPlayAgainFalse && setPlayAgainFalse()
    }

    // React Youtube Configuration
    const opts: YouTubeProps["opts"] = {
        playerVars: {
          autoplay: 1,
          mute: 1
      }
    }

    useEffect(() => {
      isMuted ? video?.mute() : video?.unMute()
      playAgain && video?.playVideo()
    },[isMuted, playAgain])

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
