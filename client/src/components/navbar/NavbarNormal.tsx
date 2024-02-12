import Logo from "../../assets/images/logo.png"
import placeholderAvatar from "../../assets/images/placeholderAvatar.png"
import searchIcon from "../../assets/images/icons/search.png"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Page as Search } from "../../pages/search/Page"
import { useRouteAndQueryParams } from "../../utils/itemsFunction"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "../../store/ZustandStore"
import { useEffect, useRef, useState } from "react"
import { scrollToTop } from "../../utils/getCurrentSection"

type NavbarProps = {
  scrollDirection : string
  isAtTop : boolean
  active : string | boolean
}

export const NavbarNormal = ( {scrollDirection, isAtTop, active} : NavbarProps ) => {
    // Params Url Getter
    const { params, categoryParams } = useRouteAndQueryParams()

    // Get search value params
    const urlParams = new URLSearchParams(window.location.search)
    const searchParams = urlParams.get("search")
    const sParam = urlParams.get("s")

    // Navigate
    const navigate = useNavigate()
    
    // Zustand State
    const { setPause, setShowVideo, setSearchClick, searchValue, setSearchValue, currentSection, setMyData, setIsMuted } = useAppStore()

    // When the user inputted in search input
    const handleChange = (event: { target: { value: string } }) =>  setSearchValue(event?.target?.value)

    useEffect(() => {
      if(searchValue !== "" && (!params || params === "Default")){
        navigate(`/?search=1&s=${searchValue}`)
      }
      else if((categoryParams !== "tv" && categoryParams !== "movie" && !params) || (searchValue === "" && searchParams === "1")){
        setSearchValue("")
        navigate("/")
      }

      if(currentSection !== "categorySection") {
        searchValue !== "" ? setPause(true) : setPause(false)
        searchValue !== "" ? setShowVideo(false) : setShowVideo(true)
      }
      searchValue !== "" && setSearchClick(true)
    },[searchValue, sParam, searchParams, currentSection])

    // Season dropdown controller
    const dropdownArray : string[] = ["Home", "TV Shows", "Movies", "New & Popular", "My List"]
    const arrayUrl : string[] = ["/", "/browse/genre/t0", "/browse/genre/m0", "/latest", ""]
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const toggleSelect = () => {
      setCloseFilter(false)
      !closeFilter && setIsOpen(!isOpen)
    }
    
    const handleSelect = (index: number) => {
      setIsOpen(false) 
      setMyData({
        id: "",
        genres: []
      }) 
      setShowVideo(false) 
      setIsMuted(true) 
      setSearchClick(false) 
      setSearchValue("")
      navigate(arrayUrl[index])
      scrollToTop()
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
    <nav 
      className={`1051size:hidden w-full py-[1.1rem] px-7 fixed top-0 flex justify-between items-center custom-transition-duration-3s
        z-[51] ${searchParams === "1" ? "bg-[#181414]" : scrollDirection === "down" || !isAtTop ? "bg-black bg-opacity-60" : "bg-custom-dark-2"}`
      }
    >
    {/* Logo and Menu */}
    <div className="flex items-center gap-x-14">
      <img src={Logo} alt="Image Logo" className="h-8"/>

      {/* Dropdown */}
      <div className={`relative ${closeFilter ? "w-auto" : "w-[19rem]"}`} ref={dropDownRef}>
        <div 
          className="flex text-white text-base cursor-pointer"
          onClick={toggleSelect}
        >
          {!closeFilter &&
            <>
              <p>Browse</p>
              <ArrowDropDownIcon/>
            </>
          }
        </div>
        
        {// Dropdown menu
        isOpen && (
          <div className="select-season absolute border py-2 border-white bg-[#000] z-50 w-[15rem] mt-1 max-h-[23rem] overflow-y-scroll">
            {dropdownArray.map((item : string, index: number) => (
              <div
                key={index}
                className={`text-white text-sm px-4 cursor-pointer hover:underline flex items-center gap-x-2 ${active === item && "font-extrabold"}`}
                onClick={() => handleSelect(index)}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    <div className="flex items-center gap-x-4">
      {/* Search Input */}
      <div className="flex items-center bg-[#1c1c1c] border-[1px] border-custom-light-2">
        <img src={searchIcon} alt="Search Image" className="h-5 mx-3"/>
        <input 
          type="text" 
          className="bg-transparent h-9 outline-none text-base  text-white w-64" 
          placeholder="Titles, people, genres"
          autoComplete="off"
          value={searchValue}
          onChange={handleChange}
        />
      </div>

      {/* Avatar */}
      <img src={placeholderAvatar} alt="Avatar" className="h-9"/>
    </div>

    {/* Search Section */
    searchParams === "1" &&
      <Search/>
    }
    </nav>
  )
}
