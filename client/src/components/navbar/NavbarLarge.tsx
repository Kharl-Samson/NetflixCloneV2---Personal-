import Logo from "../../assets/images/logo.png"
import { SearchInput } from "../../widgets/searchInput/SearchInput"
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined"
import placeholderAvatar from "../../assets/images/placeholderAvatar.png"
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import { useState } from "react"
import { useAppStore } from "../../store/ZustandStore"
import { useNavigate } from "react-router-dom"
import { scrollToTop } from "../../utils/getCurrentSection"

type NavbarProps = {
    scrollDirection : string
    isAtTop : boolean
    active : string | boolean
}
  
export const NavbarLarge = ( {scrollDirection, isAtTop, active} : NavbarProps ) => {

    // Navigate
    const navigate = useNavigate()

    // Get search value params
    const urlParams = new URLSearchParams(window.location.search)
    const searchParams = urlParams.get("search")

    // Data Links
    const arrayLink : string[] = ["Home", "TV Shows", "Movies", "New & Popular", "My List"]
    const arrayUrl : string[] = ["/", "/browse/genre/t0", "/browse/genre/m0", "/latest", ""]

    // Hover Avatar
    const [isAvatarHover, setAvatarHover] = useState<boolean>(false)

    // Zustand State
    const { setMyData, setSearchClick, setShowVideo, setSearchValue, setIsMuted } = useAppStore()

  return (
    <nav 
      className={`w-full py-4 px-14 fixed max-w-[3000px] mx-auto top-0 flex justify-between items-center custom-transition-duration-3s z-50 
        ${searchParams === "1" || active === "TV Shows" || active === "Movies" ? "bg-[#181414]" : scrollDirection === "down" || !isAtTop ? "bg-[#181414]" : "shadowing"}`
      }
    >
      {/* Logo and Menu */}
      <div className="flex items-center gap-x-10">
        <img src={Logo} alt="Image Logo" className="h-7"/>

        {/* Menu */}
        <ul className="flex gap-x-5 text-custom-light-2 ">
          {// Links Mapping
            arrayLink?.map((res: string, index: number) => (
              <li 
                onClick={() => {
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
                }}
                key={res} 
                className={`text-sm cursor-pointer hover:opacity-80 custom-transition-duration-3s font-light
                ${active === res ? "text-white pointer-events-none" : "pointer-events-auto"}`}
              >
                {res}
              </li>
            ))
          }
        </ul>
      </div>
            
      {/* Search, Notification, and Avatar */}
      <div className="text-white flex items-center gap-x-4">
        <SearchInput/>

        <NotificationsNoneOutlinedIcon sx={{fontSize:"1.8rem"}} className="cursor-pointer hover:opacity-80"/>

        {/* Avatar */}
        <div className="text-white flex items-center cursor-pointer" onMouseOver={() => setAvatarHover(true)} onMouseOut={() => setAvatarHover(false)}>
          <img src={placeholderAvatar} alt="Avatar" className="h-8 w-8 rounded"/>
          <ArrowDropDownOutlinedIcon sx={{fontSize:"2rem"}} className={`custom-transition-duration-3s ${isAvatarHover && "rotate-180"}`}/>
        </div>    
       </div>
    </nav>
  )
}
