import { useQuery } from "react-query"
import { getShowList, getShowTrailer } from "../../../services/apiFetchShowList"
import { useEffect, useState } from "react"
import { HeroComponentNormal } from "../components/HeroComponentNormal"
import { HeroComponentSmall } from "../components/HeroComponentSmall"
import { useAppStore } from "../../../store/ZustandStore"

type HeroProps = {
  category : string
  genre : number
}
export const Hero = ({category, genre} : HeroProps) => {
    // State from zustand
    const {screenWidth} = useAppStore()

    // Hero data randomizer
    const [randomPageArray, setRandomPageArray] = useState<number>(1)
    const [randomShowArray, setRandomShowArray] = useState<number>(1)

    // Randomize page number and show number
    useEffect(() => {
      const randomNumber1 = Math.floor(Math.random() * 1) + 1
      const randomNumber2 = Math.floor(Math.random() * 15) + 1
      setRandomPageArray(randomNumber1)
      setRandomShowArray(randomNumber2)
    },[])

    // Data states
    const {myData, setMyData} = useAppStore()
    const [trailerData, setTrailerData] = useState<string>("")

    // Fetch data to be showned in hero section 
    const { data, isFetched: isFetchedData, isError: isDataError, isLoading: isDataLoading } = useQuery(
      ["tvheroKey", randomPageArray, myData],
      () => getShowList("Hero", category, "en-US", genre, randomPageArray),
      { cacheTime: 0 } // Remove caching to trigger every click
    )

    // Fetch trailer data
    const { data : myTrailerData, isFetched: isFetchedTrailer, isError: isTrailerError, isLoading: isTrailerLoading } = useQuery(
      ["tvtrailerKey", myData],
      () => getShowTrailer(category, myData?.id),
      { cacheTime: 0 } // Remove caching to trigger every click
    )
    
    // When done querying put the data in states variable
    useEffect(() => {
      // Data Query
      isFetchedData && !isDataError && setMyData(data?.results[randomShowArray])

      // Trailer Data Query
      if(isFetchedTrailer && !isTrailerError && myTrailerData?.results.length !== 0){
        for(var i : number = 0 ; i < myTrailerData?.results.length ; i++){
          if (myTrailerData?.results[i]?.name?.toUpperCase().indexOf("OFFICIAL TRAILER") > -1){
            setTrailerData(myTrailerData?.results[i].key)
            break
          }
          else if(myTrailerData?.results[i]?.name?.includes("TRAILER")){
            setTrailerData(myTrailerData?.results[i].key)
            break
          }
          else{
            setTrailerData(myTrailerData?.results[0].key)
          }
        }
      }
    }, [isFetchedData, data, myData, isFetchedTrailer, myTrailerData])
 
  return (
    <section className="w-full"> 
      {/* On Smaller Screens */}
      <HeroComponentSmall
        myData = {myData}
        category = {category}
      />

      {/* On Larger Screens */}
      <HeroComponentNormal
        myData = {myData}
        trailerData = {trailerData}
        isFetchedTrailer = {isFetchedTrailer}
        isDataLoading = {isDataLoading}
        isTrailerLoading = {isTrailerLoading}
        marginStyle = { 
          screenWidth < 640 ? "mx-5" : 
          screenWidth <= 800 ? "mx-7" : 
          screenWidth <= 950 ? "mx-7" : "mx-14"
        }
        category = {category}
      />

      {/* For shadowing */
      screenWidth >= 640 && 
        <div>
          <div className="hidden sm:block max-h-[90rem] h-[40rem] 801size:h-[50rem] 951size:h-[100dvh]"></div>
          <div className="hidden sm:block z-20 shadowing-hero"></div>
        </div> 
      }
    </section>
  )
}
