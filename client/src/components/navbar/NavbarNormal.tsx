import Logo from "../../assets/images/logo.png"
import placeholderAvatar from "../../assets/images/placeholderAvatar.png"
import searchIcon from "../../assets/images/icons/search.png"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

type NavbarProps = {
  scrollDirection : string
  isAtTop : boolean
}

export const NavbarNormal = ( {scrollDirection, isAtTop} : NavbarProps ) => {
  return (
    <nav 
      className={`951size:hidden w-full py-4 px-7 fixed top-0 flex justify-between items-center custom-transition-duration-3s
        z-50 ${scrollDirection === "down" || !isAtTop ? "bg-black bg-opacity-60" : "bg-custom-dark-2"}`
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
                className="bg-transparent h-9 outline-none text-base netflix-font-light text-white w-64" 
                placeholder="Titles, people, genres"
                autoComplete="off"
            />
        </div>

        {/* Avatar */}
        <img src={placeholderAvatar} alt="Avatar" className="h-9"/>
      </div>
    </nav>
  )
}
