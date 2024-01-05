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
    playAgain : boolean
    setPlayAgainFalse : () => void
    isFetchedTrailer? : boolean
    isMuted? : boolean
}

export const YoutubePlayer = ( {
    id, videoId, duration, 
    setShowVideoFalse, setShowVideoTrue, 
    setVideoEnded, 
    playAgain, setPlayAgainFalse,
    isFetchedTrailer, isMuted
  } : YoutubePlayerProps) => {

    const [video, setVideo] = useState<any>(undefined)

    // React Youtube Configuration
    const onReady: YouTubeProps["onReady"] = (event) => {
      setVideo(() => event.target)
      if(isFetchedTrailer && videoId) {
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
      // videoId = {"FUKmyRLOlAA"} 
      opts = {opts}
      onReady = {onReady}
      onEnd = {videoEnded}
    />
  )
}
