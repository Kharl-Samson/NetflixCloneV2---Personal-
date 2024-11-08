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
      744276, // After Ever Happy
      46952,  // Blacklist
      48891,  // Brooklyn Nine-Nine
      96677,  // Lupin
      262955, // Starting 5
      385687, // Fast X
      99048,  // Startup
      980489, // Gran Turismo
      81356,  // Sex Education
      79525   // The Last Dance
    ]

    const categoryArray : string[] = [
      "movie", // After Ever Happy
      "tv",    // Blacklist
      "tv",    // Brooklyn Nine-Nine
      "tv",    // Lupin
      "tv",    // Starting 5
      "movie", // Fast X
      "tv",    // Startup
      "movie", // Gran Turismo
      "tv",    // Sex Education
      "tv"     // The Last Dance
    ]

    const colorsArray : string[] = ["#7A1E9A", "#153A70", "#2C3D2E", "#BF742E", "#37B19B", "#BF2E2E", "#636011", "#470A2B", "#03472F", "#053477"]

    // Function to generate a pseudo-random number, changes when the website is closed and reopened
    const generateSessionRandomIndex = (arrayLength: number): number => {
      // Check if there's a timestamp in localStorage
      let sessionTimestamp = localStorage.getItem("sessionTimestamp")
    
      // If no timestamp or session was not marked as active, create a new one
      if (!sessionTimestamp || !sessionStorage.getItem("isActiveSession")) {
        const now = new Date()
        sessionTimestamp = `${now.getTime()}`
        localStorage.setItem("sessionTimestamp", sessionTimestamp)
      
        // Mark the session as active
        sessionStorage.setItem("isActiveSession", "true")
      }
    
      // Use the sessionTimestamp as seed for random number generation
      let seed = Array.from(sessionTimestamp).reduce((acc, char) => acc + char.charCodeAt(0), 0)
      return seed % arrayLength
    }

   // Set the random number once a day without dependencies in the array
    const [randomNumber, setRandomNumber] = useState<number>(-1)
    const [randomNumberColor, setRandomNumberColor] = useState<number>(-1)
    useEffect(() => {
      setMyData({
        id: "",
        genres: []
      }) 
      const dailyIndex = generateSessionRandomIndex(showArray.length)
      const dailyIndexColor = generateSessionRandomIndex(colorsArray.length)
      setRandomNumber(dailyIndex)
      setRandomNumberColor(dailyIndexColor)
    }, [])

    // Data states
    const {myData, setMyData} = useAppStore()
    const [trailerData, setTrailerData] = useState<string>("")

    // Fetch data to be showned in hero section 
    const { data, isFetched: isFetchedData, isError: isDataError, isLoading: isDataLoading } = useQuery(
      ["heroKey", randomNumber, myData],
      () => randomNumber !== -1 && getShowDetails(categoryArray[randomNumber], showArray[randomNumber], "en-US"),
      { cacheTime: 0 } // Remove caching to trigger every click
    )

    // Fetch trailer data
    const { data : myTrailerData, isFetched: isFetchedTrailer, isError: isTrailerError } = useQuery(
      ["trailerKey", randomNumber, myData],
      () => randomNumber !== -1 && getShowTrailer(categoryArray[randomNumber], myData?.id),
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
    }, [isFetchedData, data, myData, isFetchedTrailer, myTrailerData, randomNumber])

  return (
    <section className="w-full"> 
      {/* On Smaller Screens */}
      <HeroComponentSmall
        myData = {myData}
        category = {categoryArray[randomNumber]}
        colorBg = {colorsArray[randomNumberColor]}
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
        category = {categoryArray[randomNumber]}
        trackId = {showArray[randomNumber]}
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
