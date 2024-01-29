import { useLayoutEffect, useState } from "react"
import "../youtubePlayer/YoutubePlayer.css"
import YouTube, { YouTubeProps } from "react-youtube"
import { useAppStore } from "../../store/ZustandStore"
import { videoEndedPhone } from "../../utils/youtubeFunction"

export const YoutubePlayerPhone = ({ id, videoId, duration, isFetchedTrailer } : YoutubePlayerTypes) => {
    // Video Data State
    const [video, setVideo] = useState<any>(null)

    // React Youtube State
    const { setShowVideoPhone, showVideoPhone, isMutedPhone, playAgainPhone } = useAppStore()

    // Video Valid State
    const [videoValid, setVideoValid] = useState<boolean>(false)

    // React Youtube Configuration
    const onReady: YouTubeProps["onReady"] = (event) => {
      event.target.setPlaybackQuality("highres")
      setVideo(() => event.target)
      if(isFetchedTrailer && videoId && event.target.getVideoData().video_id && event.target.getVideoData().isPlayable) {
        setVideoValid(true)
        const timeOut = setTimeout(() => {
          setShowVideoPhone(true)
        }, duration)
        return () => {
          clearTimeout(timeOut)
        }
      }
      else{
        setVideoValid(false)
        setShowVideoPhone(false)
        const timeOut = setTimeout(() => setShowVideoPhone(false), (duration + 100))
        return () => {
          clearTimeout(timeOut)
        }
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
      if (video && videoValid && showVideoPhone && video.g && video.g.src) {
        // Mute
        isMutedPhone ? video.mute() : video.unMute()

        // // Play Again
        playAgainPhone && video.playVideo()
      }
    },[isMutedPhone, playAgainPhone, video, videoValid, showVideoPhone])

    
  return (
    <YouTube  
      id = {id}
      videoId = {videoId}
      opts = {opts}
      onReady = {onReady}
      onEnd = {videoEndedPhone}
    />
  )
}
