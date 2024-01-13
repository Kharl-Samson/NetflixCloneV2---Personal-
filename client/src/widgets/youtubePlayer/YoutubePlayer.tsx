import { useEffect, useState } from "react"
import "../youtubePlayer/YoutubePlayer.css"
import YouTube, { YouTubeProps } from "react-youtube"
import { useAppStore } from "../../store/ZustandStore"

export const YoutubePlayer = ({ id, videoId, duration, isFetchedTrailer } : YoutubePlayerTypes) => {
    // Video Data State
    const [video, setVideo] = useState<any>(null)

    // React Youtube State
    const { setShowVideo, isMuted, setVideoEnded, playAgain, setPlayAgain, pause } = useAppStore()

    // Video Valid State
    const [videoValid, setVideoValid] = useState<boolean>(false)

    // React Youtube Configuration
    const onReady: YouTubeProps["onReady"] = (event) => {
      event.target.setPlaybackQuality("highres")
      setVideo(() => event.target)

      if(isFetchedTrailer && videoId && event.target.getVideoData()?.video_id && event.target.getVideoData()?.isPlayable) {
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
      if (video && videoValid) {
        // Mute
        isMuted ? video.mute() : video.unMute()
        // Play Again
        playAgain && video.playVideo()
        // Pause
        pause ? video.pauseVideo() : video.playVideo()
      }
    },[isMuted, playAgain, pause, video, videoValid])

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
