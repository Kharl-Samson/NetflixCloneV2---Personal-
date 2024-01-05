import Logo from "../../assets/images/logo.png"
import { SearchInput } from "../../widgets/searchInput/SearchInput"
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined"
import placeholderAvatar from "../../assets/images/placeholderAvatar.png"
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import { useState } from "react"

type NavbarProps = {
    scrollDirection : string
    isAtTop : boolean
    active : string
}
  
export const NavbarLarge = ( {scrollDirection, isAtTop, active} : NavbarProps ) => {
    // Data Links
    const arrayLink : string[] = ["Home", "TV Shows", "Movies", "New & Popular", "My List"]

    // Hover Avatar
    const [isAvatarHover, setAvatarHover] = useState<boolean>(false)

  return (
    <nav 
      className={`w-full py-4 px-14 fixed max-w-[3000px] mx-auto top-0 flex justify-between items-center custom-transition-duration-3s
        z-50 ${scrollDirection === "down" || !isAtTop ? "bg-black" : "shadowing"}`
      }
    >
        {/* Logo and Menu */}
        <div className="flex items-center gap-x-10">
            <img src={Logo} alt="Image Logo" className="h-7"/>

            {/* Menu */}
            <ul className="flex gap-x-5 text-custom-light-2 netflix-font-light disable-highlight">
                {// Links Mapping
                arrayLink?.map((res: string) => (
                    <li key={res} className={`text-sm cursor-pointer hover:opacity-80 custom-transition-duration-3s ${active === res && "text-white netflix-font-medium"}`}>{res}</li>
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
