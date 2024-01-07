import { useAppStore } from "../../../store/ZustandStore"
import play from "../../../assets/images/icons/play.png"
import add from "../../../assets/images/icons/add.png"
import { getGenres } from "../../../services/apiFetchShowList"
import { useQuery } from "react-query"
import { useEffect, useState } from "react"

type HeroProps = {
    myData : {
        original_title?: string
        backdrop_path?: string
        genre_ids?: number[]
    }
}

export const HeroComponentSmall = ( {myData} : HeroProps ) => {
    // State from zustand
    const {screenWidth} = useAppStore()

    // Get Genres -> Movie
    const { data : genreListMovie, isFetched: isFetchedMovieGenre, isError: isDataErrorMovieGenre } = useQuery(
      ["genreMovieKey"],
      () => getGenres("movie")
    )
    // Get Genres Value
    const getGenreNames = (): string[] | undefined => {
        if (!genreListMovie || !myData.genre_ids) {
          return [];
        }

        if(isFetchedMovieGenre && !isDataErrorMovieGenre) {
            const selectedGenres = genreListMovie.genres.filter((genre : {id: number, name: string}) => myData.genre_ids?.includes(genre.id))
            return selectedGenres.map((genre : {id: number, name: string}) => genre.name)
        }
    }

    // Random Color
    const colorsArray : string[] = ["#7A1E9A", "#153A70", "#2C3D2E", "#BF742E", "#37B19B", "#BF2E2E", "#636011", "#470A2B", "#03472F", "#053477"]
    const [color, setColor] = useState<string>("")
    
    // Generate random color
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * colorsArray.length)
        setColor(colorsArray[randomIndex])
    },[])

    return (
    <>
    {/* Image Banner */
    screenWidth < 640 && 
        <div className="sm:hidden pt-[6.5rem] sm:mt-4 w-full h-auto px-5" style={{ background : `linear-gradient(173deg, ${color} -40.63%, #181414 75.27%)`}}>
            <div 
                style = {{
                    backgroundImage: `linear-gradient(176deg, rgba(0, 0, 0, 0.20) 60%, ${color} 140%), url(${import.meta.env.VITE_BASE_IMAGE_URL}${myData?.backdrop_path})`
                }}
                className="w-full px-4 h-[30rem] rounded-xl bg-cover bg-top flex flex-col justify-end"
            >
                {/* Show Title */}
                <p className="mb-3 text-white text-center text-4xl sm:text-7xl movie-title-font-small">{myData?.original_title}</p>

                {/* Genre */}
                <div className="mb-3 flex flex-wrap justify-center gap-x-5 text-white">
                    {/* Genres Mapping */
                        getGenreNames()?.map((res: string, index: number) => <p className=""key={index} >{index !== 0 && '•'} {res}</p> ) 
                    }
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-x-3 mb-5">
                    <button className="w-full py-2 rounded flex items-center justify-center gap-x-2 bg-white text-sm netflix-font-medium active:opacity-80">
                        <img src={play} alt="Play Image" className="h-4"/>
                        Play
                    </button>

                    <button 
                        className="w-full py-2 rounded flex items-center justify-center 
                            gap-x-2 bg-[#080808] bg-opacity-70 text-sm text-white 
                            netflix-font-medium active:opacity-80"
                        >
                        <img src={add} alt="Add Image" className="h-4"/>
                        My List
                    </button>
                </div>

            </div>
        </div>
    }
    </>
  )
}
