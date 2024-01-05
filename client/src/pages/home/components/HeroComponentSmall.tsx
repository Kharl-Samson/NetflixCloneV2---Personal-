import { useAppStore } from "../../../store/ZustandStore"
import play from "../../../assets/images/icons/play.png"
import add from "../../../assets/images/icons/add.png"
import { getGenres } from "../../../services/apiFetchShowList"
import { useQuery } from "react-query"

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

  return (
    <>
    {/* Image Banner */
    screenWidth <= 800 && 
        <div className="801size:hidden mt-2 sm:mt-4 w-full h-auto px-5">
            <div 
                style = {{
                    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%), url(${import.meta.env.VITE_BASE_IMAGE_URL}${myData?.backdrop_path})`
                }}
                className="w-full px-4 h-[28rem] rounded-xl bg-cover bg-top flex flex-col justify-end"
            >
                {/* Show Title */}
                <p className="mb-3 text-white text-center text-4xl sm:text-7xl movie-title-font">{myData?.original_title}</p>

                {/* Genre */}
                <div className="mb-3 flex flex-wrap justify-center gap-x-5 text-white">
                    {/* Genres Mapping */
                        getGenreNames()?.map((res: string, index: number) => <p className="netflix-font-light"key={index} >{index !== 0 && '•'} {res}</p> ) 
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
