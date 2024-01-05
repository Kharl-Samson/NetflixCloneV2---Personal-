import { useQuery } from "react-query"
import { getShowList, getShowTrailer } from "../../../services/apiFetchShowList"
import { useEffect, useState } from "react"
import { HeroComponentNormal } from "../components/HeroComponentNormal"
import { HeroComponentSmall } from "../components/HeroComponentSmall"

type MyData = {
    id: number | string
    backdrop_path?: string
}

export const Hero = () => {
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
        () => getShowList(categoryArray[randomCategoryIndex], "en-US", 28, randomPageArray)
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
        isFetchedTrailer && !isTrailerError &&
            myTrailerData?.results?.forEach((res : {name : string, key : string}) => {
                switch(true) {
                    case res?.name.includes("Official Trailer"):
                        setTrailerData(res?.key)
                        break
                    case res?.name.includes("Trailer"):
                        setTrailerData(res?.key)
                        break
                    default:
                        setTrailerData(res?.key)
                        break
                }
            })
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
    </section>
  )
}
