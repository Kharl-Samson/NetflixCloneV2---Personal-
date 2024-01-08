import { useQuery } from "react-query"
import { getShowList, getShowTrailer } from "../../../services/apiFetchShowList"
import { useEffect, useState } from "react"
import { HeroComponentNormal } from "../components/HeroComponentNormal"
import { HeroComponentSmall } from "../components/HeroComponentSmall"
import { useAppStore } from "../../../store/ZustandStore"

type MyData = {
    id: number | string
    backdrop_path?: string
}

export const Hero = () => {
    // State from zustand
    const {screenWidth} = useAppStore()

    const categoryArray : string[] = ["movie"]
    const randomCategoryIndex : number = Math.floor(Math.random() * categoryArray.length)
    const [randomPageArray, setRandomPageArray] = useState<number>(1)
    const [randomShowArray, setRandomShowArray] = useState<number>(1)

    // Randomize page number and show number
    useEffect(() => {
        const randomNumber1 = Math.floor(Math.random() * 100) + 1
        const randomNumber2 = Math.floor(Math.random() * 15) + 1
        setRandomPageArray(randomNumber1)
        setRandomShowArray(randomNumber2)
    },[])

    // Data states
    const [myData, setMyData] = useState<MyData>({ id: "" })
    const [trailerData, setTrailerData] = useState<string>("")

    // Fetch data to be showned in hero section 
    const { data, isFetched: isFetchedData, isError: isDataError } = useQuery(
        ["heroKey"],
        () => getShowList("hero",categoryArray[randomCategoryIndex], "en-US", 14, randomPageArray)
    )

    // Fetch trailer data
    const { data : myTrailerData, isFetched: isFetchedTrailer, isError: isTrailerError } = useQuery(
        ["trailerKey", myData],
        () => getShowTrailer(categoryArray[randomCategoryIndex], myData?.id)
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
        />

        {/* On Larger Screens */}
        <HeroComponentNormal
            myData = {myData}
            trailerData = {trailerData}
            isFetchedTrailer = {isFetchedTrailer}
        />

        {/* For shadowing */
        screenWidth >= 640 && 
          <div>
            <div className="hidden sm:block max-h-[90rem] h-[40rem] 801size:h-[50rem] 951size:h-screen"></div>
            <div className="hidden sm:block z-20 shadowing-hero"></div>
          </div> 
        }
    </section>
  )
}
