import { convertToHoursAndMinutes } from "../../../../utils/getCurrentSection"

type ShowDescriptionProps = {
  castsData : {
    cast : {
      original_name : string
    }[]
  }
  showDetailsData : {
    number_of_seasons? : number
    number_of_episodes? : number
    runtime? : number
    release_date? : string
    last_air_date? : string
    overview : string
    genres : {
      name : string
    }[]
    tagline? : string
  }
  match : string
  age : string
  scrollToBottom: () => void
}

export const ShowDescription = ({castsData, showDetailsData, match, age, scrollToBottom} : ShowDescriptionProps) => {
    // Get Show runtime length if the category is movie
    const showRuntime = !showDetailsData?.number_of_seasons ? convertToHoursAndMinutes(showDetailsData?.runtime || 0) : null
    const { hours, minutes } = showRuntime || { hours: 0, minutes: 0 }
    
  return (
    <div className="px-14 mt-[4.5rem] relative z-10 flex gap-x-12 justify-between">
      {/* Description */}
      <div className="grow">
        <div className="flex items-center gap-x-2">
          {/* Match Percentage */}
          <p className="text-[#42c161] font-medium ">{match}% Match</p>

          {/* Release Date */}
          <p className="text-[#9b9b9b] font-medium ">{ new Date(showDetailsData?.release_date || showDetailsData?.last_air_date || "2024-01-25").getFullYear() }</p>

          {/* Season Count or Episode Count or Movie length*/}
          <p className="text-[#9b9b9b] font-medium ">
            {
              !showDetailsData?.number_of_seasons ? // If movie -> Show the movie length
                `${hours}h ${minutes}m`
              :
              showDetailsData?.number_of_seasons === 1 ? // If season but only 1 -> Show total episodes
                `${showDetailsData?.number_of_episodes} Episodes` || "No data available"
              : // If seasons but its more than 1 -> Show total seasons
                `${showDetailsData?.number_of_seasons} Seasons` || "No data available"
            }
          </p>

          {/* HD */}
          <div className="text-white rounded text-xs py-[1px] px-[4px] border border-[#9b9b9b] ">HD</div>
        </div>

        {/* Age */}
        <div className="text-white float-left mt-2 text-sm py-[1px] px-[8px] border border-white">{age}+</div>

        {/* Overview */}
        <p className="mt-[4rem] text-sm font-thin text-white clear-both ">{showDetailsData?.overview}</p>
      </div>

      {/* Casts, Genres and Tagline */}
      <div className="min-w-[16rem] max-w-[16rem] h-[2rem] ">
        {/* Cast */}
        <p className="text-[#9b9b9b] text-sm">
          Cast:&nbsp;
          {/* Cast Mapping */
          castsData && castsData.cast.slice(0, 4).map((res: { original_name: string }, index : number) => 
              <span className="text-sm text-white" key={index}>{res?.original_name},&nbsp;</span>
            )
          }
          <span className="text-sm text-white italic cursor-pointer hover:underline" onClick={scrollToBottom}>more</span>
        </p>
        {/* Genres */}
        <p className="text-[#9b9b9b] text-sm mt-4">
          Genres:&nbsp;
          {/* Cast Mapping */}
          {showDetailsData?.genres?.map((res: { name: string }, index: number, array: { name: string }[]) => 
            <span className="text-sm text-white" key={index}>
              {res?.name}{index < array.length - 1 ? ', ' : ''}
            </span>
          )}
        </p>
        {/* Tagline */}
        <p className="text-[#9b9b9b] text-sm mt-4">Tagline: <span className="text-sm text-white">{showDetailsData?.tagline || "Not Available"}</span></p>
      </div>
    </div>
  )
}
