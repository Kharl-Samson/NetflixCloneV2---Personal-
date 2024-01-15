import { useEffect, useState } from "react"
import "../youtubePlayer/YoutubePlayer.css"
import YouTube, { YouTubeProps } from "react-youtube"
import { useAppStore } from "../../store/ZustandStore"
import { videoEnded } from "../../utils/youtubeFunction"

export const YoutubePlayer = ({ id, videoId, duration, isFetchedTrailer } : YoutubePlayerTypes) => {
    // Video Data State
    const [video, setVideo] = useState<any>(null)

    // React Youtube State
    const { setShowVideo, isMuted, playAgain, pause, currentSection } = useAppStore()

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
        isMuted ? video?.mute() : video?.unMute()

        // Pause
        pause ? video?.pauseVideo() : video?.playVideo()
        
        // Play Again
        playAgain && video?.playVideo()
      }
    },[isMuted, playAgain, pause, video, videoValid])

    useEffect(() => {
      // Pause if the user is not on hero section
      if (video && videoValid) {
        currentSection === "categorySection" ? video?.pauseVideo() : video?.playVideo()
      }
    }, [currentSection])


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
