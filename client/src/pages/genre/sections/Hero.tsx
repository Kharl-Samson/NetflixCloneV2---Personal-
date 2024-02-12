import { useQuery } from "react-query"
import { getShowDetails, getShowTrailer } from "../../../services/apiFetchShowList"
import { useEffect, useState } from "react"
import { HeroComponentNormal } from "../components/HeroComponentNormal"
import { HeroComponentSmall } from "../components/HeroComponentSmall"
import { useAppStore } from "../../../store/ZustandStore"
import { useRouteAndQueryParams } from "../../../utils/itemsFunction"

export const Hero = () => {
    // Params Url Getter
    const { categoryParams } = useRouteAndQueryParams()

    // State from zustand
    const {screenWidth} = useAppStore()

    // Hero data randomizer
    const showArrayTv : number[] = [
      1396,   // Breaking Bad
      71446,  // Money Heist
      76669,  // Elite
      80307,  // Bodyguard
      127532, // Solo Leveling
      66732,  // Stranger Things
    ]

    const showArrayMovie : number[] = [
      866398,   // Beekeper
      537116,   // Tick Tick Boom
      291805,   // Now You See Me 2
      454983,   // The Kissing Booth
      955916,   // Lift
      509967,   // 6 Underground
    ]
    const colorsArray : string[] = ["#2C3D2E", "#37B19B", "#BF2E2E", "#03472F", "#636011", "#470A2B", "#053477", "#7A1E9A", "#153A70", "#BF742E"]

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
      const dailyIndex = generateSessionRandomIndex(showArrayTv.length)
      const dailyIndexColor = generateSessionRandomIndex(colorsArray.length)
      setRandomNumber(dailyIndex)
      setRandomNumberColor(dailyIndexColor)
    }, [])

    // Data states
    const {myData, setMyData} = useAppStore()
    const [trailerData, setTrailerData] = useState<string>("")

    // Fetch data to be showned in hero section 
    const { data, isFetched: isFetchedData, isError: isDataError, isLoading: isDataLoading } = useQuery(
      ["tvOrMovieheroKey", randomNumber, myData],
      () => randomNumber !== -1 && getShowDetails(categoryParams === "t0" ? "tv" :  "movie", categoryParams === "t0" ? showArrayTv[randomNumber] : showArrayMovie[randomNumber], "en-US"),
      { cacheTime: 0 } // Remove caching to trigger every click
    )

    // Fetch trailer data
    const { data : myTrailerData, isFetched: isFetchedTrailer, isError: isTrailerError } = useQuery(
      ["tvOrMovietrailerKey", randomNumber, myData],
      () => randomNumber !== -1 && getShowTrailer(categoryParams === "t0" ? "tv" :  "movie", myData?.id),
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
        category = {categoryParams === "t0" ? "tv" :  "movie"}
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
        category = {categoryParams === "t0" ? "tv" :  "movie"}
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
