import { useLayoutEffect, useState } from "react"
import "../youtubePlayer/YoutubePlayer.css"
import YouTube, { YouTubeProps } from "react-youtube"
import { useAppStore } from "../../store/ZustandStore"
import { videoEnded } from "../../utils/youtubeFunction"

export const YoutubePlayer = ({ id, videoId, duration, isFetchedTrailer } : YoutubePlayerTypes) => {
    // Video Data State
    const [video, setVideo] = useState<any>(null)

    // React Youtube State
    const { setShowVideo, isMuted, playAgain, pause, currentSection } = useAppStore()

    // Get search value params
    const urlParams = new URLSearchParams(window.location.search)
    const searchParams = urlParams.get("search")

    // React Youtube Configuration
    const onReady: YouTubeProps["onReady"] = (event) => {
      event.target.setPlaybackQuality("highres")
      setVideo(() => event.target)

      if(searchParams !== "1" && isFetchedTrailer && videoId && event.target.getVideoData().video_id && event.target.getVideoData().isPlayable) {
        const timeOut = setTimeout(() => setShowVideo(true), duration)
        return () => clearTimeout(timeOut)
      }
      else{
        searchParams !== "1" && setShowVideo(false)
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
      if (video && video.g && video.g.src) {
        // Mute
        isMuted ? video.mute() : video.unMute()
        // Pause
        pause ? video.pauseVideo() : video.playVideo()   
        // Play Again
        playAgain && video.playVideo()
      }
    },[isMuted, playAgain, pause, video])

    useLayoutEffect(() => {
      // Pause if the user is not on hero section
      if (video && video.g && video.g.src) {
        currentSection === "categorySection" ? video.pauseVideo() : video.playVideo()
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
