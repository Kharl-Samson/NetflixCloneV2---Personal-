import { useLayoutEffect, useState } from "react"
import "../youtubePlayer/YoutubePlayer.css"
import YouTube, { YouTubeProps } from "react-youtube"
import { useAppStore } from "../../store/ZustandStore"
import { videoEndedModal } from "../../utils/youtubeFunction"

export const YoutubePlayerModal = ({ id, videoId, duration, isFetchedTrailer } : YoutubePlayerTypes) => {
    // Video Data State
    const [video, setVideo] = useState<any>(null)

    // React Youtube State
    const { setShowVideoModal, showVideoModal, isMutedModal, playAgainModal } = useAppStore()

    // Video Valid State
    const [videoValid, setVideoValid] = useState<boolean>(false)

    // React Youtube Configuration
    const onReady: YouTubeProps["onReady"] = (event) => {
      event.target.setPlaybackQuality("highres")
      setVideo(() => event.target)
      if(isFetchedTrailer && videoId && event.target.getVideoData().video_id && event.target.getVideoData().isPlayable) {
        setVideoValid(true)
        const timeOut = setTimeout(() => {
          setShowVideoModal(true)
        }, duration)
        return () => {
          clearTimeout(timeOut)
        }
      }
      else{
        setVideoValid(false)
        setShowVideoModal(false)
        const timeOut = setTimeout(() => setShowVideoModal(false), (duration + 100))
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
      if (video && videoValid && showVideoModal && video.g && video.g.src) {
        // Mute
        isMutedModal ? video.mute() : video.unMute()

        // // Play Again
        playAgainModal && video.playVideo()
      }
    },[isMutedModal, playAgainModal, video, videoValid, showVideoModal])

    
  return (
    <YouTube  
      id = {id}
      videoId = {videoId}
      opts = {opts}
      onReady = {onReady}
      onEnd = {videoEndedModal}
    />
  )
}
