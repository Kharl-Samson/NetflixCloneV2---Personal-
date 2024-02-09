import { useQuery } from "react-query"
import { getGenres } from "../../services/apiFetchShowList"
import { useAppStore } from "../../store/ZustandStore"
import { useEffect, useRef, useState } from "react"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"

type SubNavbarProps = {
    isAtTop : boolean
    category : string | boolean
}

export const SubnavBar = ({isAtTop, category} : SubNavbarProps) => {

    // Zustand state
    const {currentPage} = useAppStore()

    // Get Genres
    const { data : genreListData} = useQuery(
      ["genreDataKey", currentPage],
      () => getGenres(category)
    )

    // Genre dropdown controller
    const [selectedSeason, setSelectedSeason] = useState<string>("Genres")
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const toggleSelect = () => {
      setCloseFilter(false)
      !closeFilter && setIsOpen(!isOpen)
    }

    const handleSelect = (option: string) => {
      setSelectedSeason(option)
      setIsOpen(false)
    }

    // Closing dropdown
    const dropDownRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => dropDownRef.current && !dropDownRef.current.contains(event.target as Node) && setIsOpen(false)
      window.addEventListener("mousedown", handleClickOutside)
      return () => window.removeEventListener("mousedown", handleClickOutside)
    }, [dropDownRef])

    // Close Filter
    const [closeFilter, setCloseFilter] = useState<boolean>(false)

  return (
    <div className={`w-full px-7 1051size:px-14 fixed flex gap-x-12 left-0 z-50 top-[4.5rem] 1051size:top-[4.5rem] h-[4.2rem] ${!isAtTop && "bg-black bg-opacity-60 1051size:bg-[#181414]"}`}>
      <p className="text-white font-bold text-4xl mt-3">{currentPage}</p>

      {/* Dropdown */}
      <div className={`relative mt-4 ${closeFilter ? "w-auto" : "w-auto"}`} ref={dropDownRef}>
        <div 
          className={`h-[2.2rem] text-white border px-4 cursor-pointer relative flex items-center gap-x-4 border-white hover:bg-[#ffffff36]
            ${isOpen ? "bg-[#ffffff36]" : "bg-[#000000af]"}`}
          onClick={toggleSelect}
        >
          {!closeFilter &&
            <>
              <p className="mr-5">{selectedSeason}</p>
              <span className="mr-[.5rem] absolute inset-y-0 right-0 flex items-center transition-transform">
                <ArrowDropDownIcon/>
              </span>
            </>
          }
        </div>
      
        {// Dropdown menu
        isOpen && (
          <div className="select-season absolute py-2 bg-[#000000dc] w-[26rem] z-[11] grid grid-cols-3">
            {genreListData?.genres.map((item : {name: string}, index: number) => (
              <p
                key={index}
                className="text-white text-sm w-auto whitespace-nowrap px-4 my-[.20rem] cursor-pointer hover:underline flex items-center"
                onClick={() => handleSelect(item.name)}
              >
                {item.name}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
