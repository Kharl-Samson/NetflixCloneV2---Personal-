import { useEffect, useState } from "react"
import { convertToHoursAndMinutes } from "../../../../utils/getCurrentSection"
import { useAppStore } from "../../../../store/ZustandStore"

type ShowDescriptionProps = {
    castsData : {
        cast : {
            original_name : string
        }[]
    }
}

export const ShowDescription = ({castsData} : ShowDescriptionProps) => {
    // React Youtube State
    const { showDetails } = useAppStore()

    // Random Array - [Match and Age]
    const matchArray : string[] = ["95", "96","97", "98"]
    const ageArray : string[] = ["10", "13", "16"]
    const [match, setMatch] = useState<string>("")
    const [age, setAge] = useState<string>("")
    useEffect(() => {
      const randomMatch = Math.floor(Math.random() * matchArray.length)
      const randomAge = Math.floor(Math.random() * ageArray.length)
      setMatch(matchArray[randomMatch])
      setAge(ageArray[randomAge])
    },[])

     // Get Show runtime length if the category is movie
    const showRuntime = !showDetails?.number_of_seasons ? convertToHoursAndMinutes(showDetails?.runtime || 0) : null
    const { hours, minutes } = showRuntime || { hours: 0, minutes: 0 }

  return (
    <div className="px-14 mt-[4.5rem] relative z-10 flex gap-x-12 justify-between">
      {/* Description */}
      <div className="grow">
        <div className="flex items-center gap-x-2">
          {/* Match Percentage */}
          <p className="text-[#42c161] font-medium disable-highlight">{match}% Match</p>

          {/* Release Date */}
          <p className="text-[#9b9b9b] font-medium disable-highlight">{ new Date(showDetails?.release_date || showDetails?.last_air_date).getFullYear() }</p>

          {/* Season Count or Episode Count or Movie length*/}
          <p className="text-[#9b9b9b] font-medium disable-highlight">
            {
              !showDetails?.number_of_seasons ? // If movie -> Show the movie length
                `${hours}h ${minutes}m`
              :
              showDetails?.number_of_seasons === 1 ? // If season but only 1 -> Show total episodes
                `${showDetails?.number_of_episodes} Episodes` || "No data available"
              : // If seasons but its more than 1 -> Show total seasons
                `${showDetails?.number_of_seasons} Seasons` || "No data available"
            }
          </p>

          {/* HD */}
          <div className="text-white rounded text-xs py-[1px] px-[4px] border border-[#9b9b9b] disable-highlight">HD</div>
        </div>

        {/* Age */}
        <div className="text-white float-left mt-2 text-sm py-[1px] px-[8px] border border-white">{age}+</div>

        {/* Overview */}
        <p className="mt-[4rem] text-sm font-thin text-white clear-both disable-highlight">{showDetails?.overview}</p>
      </div>

      {/* Casts, Genres and Tagline */}
      <div className="min-w-[16rem] max-w-[16rem] h-[2rem] disable-highlight">
        {/* Cast */}
        <p className="text-[#9b9b9b] text-sm">
          Cast:&nbsp;
          {/* Cast Mapping */
            castsData?.cast?.slice(0, 4).map((res: { original_name: string }) => 
              <span className="text-sm text-white" key={res?.original_name}>{res?.original_name},&nbsp;</span>
            )
          }
          <span className="text-sm text-white italic cursor-pointer hover:underline">more</span>
        </p>
        {/* Genres */}
        <p className="text-[#9b9b9b] text-sm mt-4">
          Genres:&nbsp;
          {/* Cast Mapping */}
          {showDetails?.genres?.map((res: { name: string }, index: number, array: { name: string }[]) => 
            <span className="text-sm text-white" key={res?.name}>
              {res?.name}{index < array.length - 1 ? ', ' : ''}
            </span>
          )}
        </p>
        {/* Taglne */}
        <p className="text-[#9b9b9b] text-sm mt-4">Tagline: <span className="text-sm text-white">{showDetails?.tagline || "Not Available"}</span></p>
      </div>
    </div>
  )
}
