import MenuIcon from "@mui/icons-material/Menu"
import Logo from "../../assets/images/logo.png"
import searchIcon from "../../assets/images/icons/search.png"

type NavbarProps = {
  scrollDirection : string
  isAtTop : boolean
}

export const NavbarMedium = ( {scrollDirection, isAtTop} : NavbarProps ) => {
  return (
    <nav 
      className={`801size:hidden w-full py-4 px-7 sticky top-0 flex justify-between items-center custom-transition-duration-3s
        z-50 ${scrollDirection === "down" || !isAtTop ? "bg-black bg-opacity-60" : "bg-custom-dark-2"}`
      }
    >
        {/* Logo and Menu */}
        <div className="flex items-center gap-x-4">
            <MenuIcon sx={{color:"#ffff", fontSize:'2.1rem'}}/>
            <img src={Logo} alt="Image Logo" className="h-6"/>
        </div>

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
    </nav>
  )
}
