import { useEffect, useState } from "react"
import { useAppStore } from "../../../store/ZustandStore"
import { YoutubePlayer } from "../../../widgets/youtubePlayer/YoutubePlayer"
import play from "../../../assets/images/icons/play.png"
import info from "../../../assets/images/icons/info.svg"

type HeroProps = {
    myData : {
        backdrop_path?: string
        original_title?: string
        overview?: string
    }
    trailerData : string
    isFetchedTrailer : boolean
}

export const HeroComponentNormal = ( {myData, trailerData, isFetchedTrailer} : HeroProps ) => {
    // State from zustand
    const {screenWidth} = useAppStore()

    // React Youtube State
    const [showVideo, setShowVideo] = useState<boolean>(false)
    const [isMuted, setIsMuted] = useState<boolean>(true)
    const [videoEnded, setVideoEnded] = useState<boolean>(false)
    const [playAgain, setPlayAgain] = useState<boolean>(false)
    const toggleVideoSound = () => {
        setPlayAgain(false)
        setIsMuted(prevState => !prevState)
        if(videoEnded) {
            setVideoEnded(false)
            setShowVideo(true)
            setIsMuted(true)
            setPlayAgain(true)
        }
    }

    // State for text animation
    const [textAnim, setTextAnim] = useState<boolean>(false)
    useEffect(() => {
        const timeOut = setTimeout(() => setTextAnim(true),5000)
        return () => clearTimeout(timeOut)
    },[])

  return (
    <>
        {/* Image Banner */
        screenWidth >= 640 && 
            <img 
                src={`${import.meta.env.VITE_BASE_IMAGE_URL}${myData?.backdrop_path}`}
                alt="Movie Image"
                className={`max-h-[90rem] hidden sm:block absolute top-0 max-w-[3000px] mx-auto w-full h-[45rem] 801size:h-[50rem]
                    951size:h-screen object-center object-cover custom-transition-duration-10s z-10
                  bg-black bg-opacity-50 image-inline-shadow ${showVideo ? "opacity-0" : "opacity-100"}`}
            />
        }

        {/* Video Player */
        screenWidth >= 640 &&
            <div className={`max-h-[90rem] hidden absolute max-w-[3000px] mx-auto top-0 w-full h-[45rem] 801size:h-[50rem] 951size:h-screen overflow-hidden z-0 ${showVideo && "sm:block"}`}>
                <YoutubePlayer
                    id = "youtubePlayer"
                    videoId = {trailerData} 
                    duration = {5000}
                    setShowVideoFalse = {() => setShowVideo(false)}
                    setShowVideoTrue = {() => setShowVideo(true)}
                    setVideoEnded = {() => setVideoEnded(true)}
                    playAgain = {playAgain}
                    setPlayAgainFalse = {() => setPlayAgain(false)}
                    isFetchedTrailer = {isFetchedTrailer}
                    isMuted = {isMuted}
                />
            </div>
        }

        {/* Main Content */
        screenWidth >= 640 && 
            <div className="max-w-[3000px] max-h-[90rem] mx-auto z-20 absolute top-0 hidden sm:flex flex-col 
                justify-center w-full h-[45rem] 801size:h-[50rem] 951size:h-screen px-7 951size:px-14"
                style = {{background: "linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%)"}}
            >
                <p 
                    className={`mt-[0rem] text-white custom-transition-duration-10s
                        movie-title-font-large max-w-[40rem] xl:max-w-[80%] 
                        leading-tight ${textAnim ? "text-4xl 801size:text-5xl xl:text-7xl" : "text-5xl 801size:text-7xl xl:text-8xl"}`}
                >
                    {myData?.original_title}
                </p>
                <p 
                    className={`mt-4 text-white text-base xl:text-xl max-w-[70%] xl:max-w-[50%] custom-transition-duration-10s
                        ${textAnim ? "hidden" : "block"}`}
                >
                    {myData?.overview}
                </p>

                <div className="mt-10 flex gap-x-[15px]">
                  <button className="rounded-md flex items-center gap-x-[15px] font-netflix_regular py-[11px] px-[35px] transition duration-400 bg-white hover:opacity-80">
                    <img src={play} alt="Play Icon" className="h-[27px]"/>
                    <span className="text-[1.4rem] font-semibold">Play</span>
                  </button>

                  <button className="rounded-md flex items-center gap-x-[15px] font-netflix_regular py-[11px] px-[35px] transition duration-400 bg-[#857e7ea8] hover:opacity-80">
                    <img src={info} alt="Info Icon" className="h-[27px]"/>
                    <span className="text-[1.4rem] text-white font-semibold">More Info</span>
                  </button>
                </div>
            </div>
        }

        {/* Age and Sounds Controller */
        screenWidth >= 640 &&
            <div className="hidden z-20 absolute max-w-[3000px] mx-auto right-0 text-white bottom-[20rem] 801size:bottom-[33rem] 
                    951size:bottom-[17rem] 2xl:bottom-[15rem] sm:flex gap-5 items-center disable-highlight"
            >
                <div 
                  className={`h-[50px] w-[50px] border border-solid border-white rounded-full items-center cursor-pointer
                    justify-center transition duration-400 hover:bg-gray-600 hover:bg-opacity-35 ${(showVideo || videoEnded) ? "flex" : "hidden"}`} 
                  onClick={toggleVideoSound}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`Hawkins-Icon Hawkins-Icon-Standard ${showVideo && isMuted && !videoEnded ? "block" : "hidden"}`}><path d="M11 4.00003C11 3.59557 10.7564 3.23093 10.3827 3.07615C10.009 2.92137 9.57889 3.00692 9.29289 3.29292L4.58579 8.00003H1C0.447715 8.00003 0 8.44774 0 9.00003V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00003ZM5.70711 9.70714L9 6.41424V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70714ZM15.2929 9.70714L17.5858 12L15.2929 14.2929L16.7071 15.7071L19 13.4142L21.2929 15.7071L22.7071 14.2929L20.4142 12L22.7071 9.70714L21.2929 8.29292L19 10.5858L16.7071 8.29292L15.2929 9.70714Z" fill="currentColor"></path></svg>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`Hawkins-Icon Hawkins-Icon-Standard ${showVideo && !isMuted && !videoEnded ? "block" : "hidden"}`}><path d="M24 12C24 8.28699 22.525 4.72603 19.8995 2.10052L18.4853 3.51474C20.7357 5.76517 22 8.81742 22 12C22 15.1826 20.7357 18.2349 18.4853 20.4853L19.8995 21.8995C22.525 19.274 24 15.7131 24 12ZM11 4.00001C11 3.59555 10.7564 3.23092 10.3827 3.07613C10.009 2.92135 9.57889 3.00691 9.29289 3.29291L4.58579 8.00001H1C0.447715 8.00001 0 8.44773 0 9.00001V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00001ZM5.70711 9.70712L9 6.41423V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70712ZM16.0001 12C16.0001 10.4087 15.368 8.8826 14.2428 7.75739L12.8285 9.1716C13.5787 9.92174 14.0001 10.9392 14.0001 12C14.0001 13.0609 13.5787 14.0783 12.8285 14.8285L14.2428 16.2427C15.368 15.1174 16.0001 13.5913 16.0001 12ZM17.0709 4.92896C18.9462 6.80432 19.9998 9.34786 19.9998 12C19.9998 14.6522 18.9462 17.1957 17.0709 19.0711L15.6567 17.6569C17.157 16.1566 17.9998 14.1218 17.9998 12C17.9998 9.87829 17.157 7.84346 15.6567 6.34317L17.0709 4.92896Z" fill="currentColor"></path></svg>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`Hawkins-Icon Hawkins-Icon-Standard ${videoEnded ? "block" : "hidden"}`}><path d="M13.1747 3.07702C11.01 2.79202 8.81537 3.30372 6.99988 4.51679C5.18439 5.72987 3.8718 7.56158 3.30668 9.67065C2.74155 11.7797 2.96243 14.0223 3.92815 15.9806C4.89388 17.9389 6.53859 19.4794 8.55586 20.3149C10.5731 21.1505 12.8254 21.2242 14.893 20.5224C16.9606 19.8205 18.7025 18.391 19.7942 16.5L18.0622 15.5C17.2131 16.9708 15.8582 18.0826 14.2501 18.6285C12.642 19.1744 10.8902 19.1171 9.32123 18.4672C7.75224 17.8173 6.47302 16.6192 5.7219 15.096C4.97078 13.5729 4.79899 11.8287 5.23853 10.1883C5.67807 8.5479 6.69897 7.12324 8.11102 6.17973C9.52307 5.23623 11.23 4.83824 12.9137 5.05991C14.5974 5.28158 16.1432 6.10778 17.2629 7.3846C18.1815 8.43203 18.762 9.7241 18.9409 11.0921L17.5547 10.168L16.4453 11.8321L19.4453 13.8321C19.7812 14.056 20.2188 14.056 20.5547 13.8321L23.5547 11.8321L22.4453 10.168L20.9605 11.1578C20.784 9.27909 20.0201 7.49532 18.7666 6.06591C17.3269 4.42429 15.3395 3.36202 13.1747 3.07702Z" fill="currentColor"></path></svg>
                </div>

                <div className="bg-[#857e7ea8] border-l-[3px] border-white h-[50px] w-[125px] flex items-center">
                  <span className="text-[1.3rem] ml-4">18+</span>
                </div>
            </div>
        }
    </>
  )
}
