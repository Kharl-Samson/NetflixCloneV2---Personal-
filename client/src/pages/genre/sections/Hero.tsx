import { useQuery } from "react-query"
import { getShowDetails, getShowTrailer } from "../../../services/apiFetchShowList"
import { useEffect, useState } from "react"
import { HeroComponentNormal } from "../components/HeroComponentNormal"
import { HeroComponentSmall } from "../components/HeroComponentSmall"
import { useAppStore } from "../../../store/ZustandStore"

export const Hero = () => {
    // State from zustand
    const {screenWidth} = useAppStore()

    // Hero data randomizer
    const showArray : number[] = [
      1396,   // Breaking Bad
      71446,  // Money Heist
      76669,  // Elite
      80307,  // Bodyguard
      127532, // Solo Leveling
      66732,  // Stranger Things
    ]

    // Function to generate a pseudo-random number based on the current date
    const generateDailyRandomIndex = (arrayLength: number): number => {
      const today = new Date()
      const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
      let seed = Array.from(dateString).reduce((acc, char) => acc + char.charCodeAt(0), 0)
      return seed % arrayLength
    }

   // Set the random number once a day without dependencies in the array
    const [randomNumber, setRandomNumber] = useState<number>(-1)
    useEffect(() => {
      const dailyIndex = generateDailyRandomIndex(showArray.length);
      setRandomNumber(dailyIndex)
    }, [])

    // Data states
    const {myData, setMyData} = useAppStore()
    const [trailerData, setTrailerData] = useState<string>("")

    // Fetch data to be showned in hero section 
    const { data, isFetched: isFetchedData, isError: isDataError, isLoading: isDataLoading } = useQuery(
      ["tvheroKey", randomNumber, myData],
      () => randomNumber !== -1 && getShowDetails("tv", showArray[randomNumber], "en-US"),
      { cacheTime: 0 } // Remove caching to trigger every click
    )

    // Fetch trailer data
    const { data : myTrailerData, isFetched: isFetchedTrailer, isError: isTrailerError } = useQuery(
      ["tvtrailerKey", randomNumber, myData],
      () => randomNumber !== -1 && getShowTrailer("tv", myData?.id),
      { cacheTime: 0 } // Remove caching to trigger every click
    )
    
    // When done querying put the data in states variable
    useEffect(() => {
      // Data Query
      randomNumber !== -1 && isFetchedData && !isDataError && setMyData(data)

      // Trailer Data Query
      if(randomNumber !== -1 && isFetchedTrailer && !isTrailerError && myTrailerData?.results.length !== 0){
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
        category = {"tv"}
      />

      {/* On Larger Screens */}
      <HeroComponentNormal
        myData = {myData}
        trailerData = {trailerData}
        isFetchedTrailer = {isFetchedTrailer}
        isDataLoading = {isDataLoading}
        marginStyle = { 
          screenWidth < 640 ? "mx-5" : 
          screenWidth <= 800 ? "mx-7" : 
          screenWidth <= 950 ? "mx-7" : "mx-14"
        }
        category = {"tv"}
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
