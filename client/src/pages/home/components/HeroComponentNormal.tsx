import { useState } from "react"
import { useAppStore } from "../../../store/ZustandStore"
import { YoutubePlayer } from "../../../widgets/youtubePlayer/YoutubePlayer"

type HeroProps = {
    myData : {
        backdrop_path?: string
    }
    trailerData : string
    isFetchedTrailer : boolean
}

export const HeroComponentNormal = ( {myData, trailerData, isFetchedTrailer} : HeroProps ) => {
    // State from zustand
    const {screenWidth} = useAppStore()

    // React Youtube Configuration
    const [showVideo, setShowVideo] = useState<boolean>(false)
 
    const videoStatus = (timeout : number ) => {
        if(isFetchedTrailer && trailerData) {
            const timeOut = setTimeout(() => setShowVideo(true), timeout)
            return () => clearTimeout(timeOut)
        }
    }
    const onReady = () => {
        videoStatus(5000)
    }

    const videoEnded = () => setShowVideo(false)

  return (
    <>
        {/* Image Banner */
        screenWidth > 800 && 
            <img 
                src={`${import.meta.env.VITE_BASE_IMAGE_URL}${myData?.backdrop_path}`} 
                alt="Show Banner" 
                className={`hidden 801size:block absolute w-full h-[50rem] 951size:h-screen object-center custom-transition-duration-10s
                    object-cover image-inline-shadow z-10 ${showVideo ? "opacity-0" : "opacity-100"}`}
            />
        }

        {/* Video Player */
        screenWidth > 800 &&
            <div className={`hidden absolute top-0 w-full h-[50rem] 951size:h-screen overflow-hidden z-0 ${showVideo && "801size:block"}`}>
                <YoutubePlayer
                    id = "youtubePlayer"
                    videoId = {trailerData} 
                    timeOut = {onReady}
                    videoEnded = {videoEnded}
                />
            </div>
        }

        {/* For hiding controls */
        screenWidth > 800 &&
            <div className="hidden 801size:block absolute h-[5rem] w-full bg-custom-color-hero-1 top-[45rem] 951size:top-[100vh] z-10"></div>
        }

        {/* For shadowing */
        screenWidth > 800 &&
            <div className="hidden 801size:block shadowing-hero bottom-[17rem] 951size:bottom-[-2rem] 2xl:bottom-[-6rem]"></div>
        }
    </>
  )
}
