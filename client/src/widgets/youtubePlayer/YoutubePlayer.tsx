import "../youtubePlayer/YoutubePlayer.css"
import YouTube, { YouTubeProps } from "react-youtube"

type YoutubePlayerProps = {
    id : string
    videoId : string
    timeOut? : any
    videoEnded? : () => void
}

export const YoutubePlayer = ( {id, videoId, timeOut, videoEnded} : YoutubePlayerProps) => {
    // React Youtube Configuration
    const opts: YouTubeProps["opts"] = {
        playerVars: {
          autoplay: 1,
          mute: 0
        }
    }

  return (
    <YouTube 
      id = {id}
      videoId = {videoId} 
      opts = {opts}
      onReady = {timeOut}
      onEnd = {videoEnded}
    />
  )
}
