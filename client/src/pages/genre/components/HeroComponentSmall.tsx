import { useAppStore } from "../../../store/ZustandStore"
import play from "../../../assets/images/icons/play.png"
import add from "../../../assets/images/icons/add.png"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type HeroProps = {
  myData : {
    id: string
    title?: string
    name? : string
    original_title?: string
    backdrop_path?: string
    genres: {
      name: string
    }[]
  }
  category : string
}

export const HeroComponentSmall = ( {myData, category} : HeroProps ) => {
    // Navigate
    const navigate = useNavigate()

    // State from zustand
    const {screenWidth} = useAppStore()

    // Random Color
    const colorsArray : string[] = ["#7A1E9A", "#153A70", "#2C3D2E", "#BF742E", "#37B19B", "#BF2E2E", "#636011", "#470A2B", "#03472F", "#053477"]
    const [color, setColor] = useState<string>("")
    
    // Generate random color
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * colorsArray.length)
        setColor(colorsArray[randomIndex])
    },[])

  return (
  /* Image Banner */
  screenWidth < 640 && 
    <div className="sm:hidden pt-[12rem] 211size:pt-[9rem] 329size:pt-[6.5rem] sm:mt-4 w-full h-auto px-5" style={{ background : `linear-gradient(173deg, ${color} -40.63%, #181414 75.27%)`}}>
      <div 
        style = {{
          backgroundImage: `linear-gradient(176deg, rgba(0, 0, 0, 0.20) 60%, ${color} 140%),
            url(${myData?.backdrop_path && import.meta.env.VITE_BASE_IMAGE_URL}${myData?.backdrop_path})`
        }}
        className="bg-custom-color-hero-1 w-full px-4 h-[30rem] rounded-xl bg-cover bg-top flex flex-col justify-end"
        onClick={() => navigate(`/browse/${category}?q=${myData?.id}`)}
      >
        {/* Show Title */}
        <p className="mb-3 text-white text-center text-4xl sm:text-7xl movie-title-font-small">{myData?.title || myData?.name || myData?.original_title}</p>

        {/* Genre */}
        <div className="mb-3 flex flex-wrap justify-center gap-x-5 text-white">
          {/* Genres Mapping */
          myData?.genres?.map((res: {name : string}, index: number) => <p key={index} >{index !== 0 && '•'} {res.name}</p>) 
          }
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-x-3 mb-5">
          <button className="w-full py-2 rounded flex items-center justify-center gap-x-2 bg-white text-sm active:opacity-80">
            <img src={play} alt="Play Image" className="h-4"/>
            Play
          </button>

          <button 
            className="w-full py-2 rounded flex items-center justify-center text-white
                gap-x-2 bg-[#080808] bg-opacity-70 text-sm active:opacity-80"
            >
            <img src={add} alt="Add Image" className="h-4"/>
            My List
          </button>
        </div>

      </div>
    </div>
  )
}
