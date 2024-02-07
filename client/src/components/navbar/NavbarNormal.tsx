import Logo from "../../assets/images/logo.png"
import placeholderAvatar from "../../assets/images/placeholderAvatar.png"
import searchIcon from "../../assets/images/icons/search.png"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Page as Search } from "../../pages/search/Page"
import { useRouteAndQueryParams } from "../../utils/itemsFunction"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "../../store/ZustandStore"
import { useEffect } from "react"

type NavbarProps = {
  scrollDirection : string
  isAtTop : boolean
}

export const NavbarNormal = ( {scrollDirection, isAtTop} : NavbarProps ) => {
    // Params Url Getter
    const { params, categoryParams } = useRouteAndQueryParams()

    // Get search value params
    const urlParams = new URLSearchParams(window.location.search)
    const searchParams = urlParams.get("search")
    const sParam = urlParams.get("s")

    // Navigate
    const navigate = useNavigate()
    
    // Zustand State
    const { setPause, setShowVideo, setSearchClick, searchValue, setSearchValue, currentSection } = useAppStore()

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

  return (
    <nav 
      className={`1051size:hidden w-full py-[1.1rem] px-7 fixed top-0 flex justify-between items-center custom-transition-duration-3s
        z-50 ${searchParams === "1" ? "bg-[#181414]" : scrollDirection === "down" || !isAtTop ? "bg-black bg-opacity-60" : "bg-custom-dark-2"}`
      }
    >
    {/* Logo and Menu */}
    <div className="flex items-center gap-x-14">
      <img src={Logo} alt="Image Logo" className="h-8"/>
      <div className="flex text-white text-base cursor-pointer active:scale-[.98]">
        <p>Browse</p>
        <ArrowDropDownIcon/>
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
