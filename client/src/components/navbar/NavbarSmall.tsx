import { useNavigate } from "react-router-dom"
import searchIcon from "../../assets/images/icons/search.png"
import { useRouteAndQueryParams } from "../../utils/itemsFunction"
import { scrollToTop } from "../../utils/getCurrentSection"

type NavbarProps = {
  scrollDirection : string
  isAtTop : boolean
}

export const NavbarSmall = ( {scrollDirection, isAtTop} : NavbarProps ) => {
  // Params Url Getter
  const { categoryParams } = useRouteAndQueryParams()

  // Navigate
  const navigate = useNavigate()

  // Username
  const userName : string = "You"

  return (
    <nav className={`sm:hidden w-full py-4 px-5 fixed top-0 z-50 ${(scrollDirection === "down" || !isAtTop) && "navbar-glassmorphism"}`}>

      {/* Top Section */}
      <div className="flex justify-between items-center">
        <p className="text-white  font-semibold text-lg whitespace-nowrap overflow-hidden text-ellipsis">For {userName}</p>
        <img src={searchIcon} alt="Search Image" className="h-6" onClick={() => navigate("/search")}/>
      </div>

      {/* Bottom Section */}
      <div 
        className={`flex flex-wrap gap-x-2 gap-y-3 text-custom-light-2 overflow-hidden
          custom-transition-duration-3s ${scrollDirection === "down" ? "h-0" : "mt-4 h-auto"}`}
      >

        {/* Close */
        (categoryParams === "t0" || categoryParams === "m0") &&
        <div 
          className="h-[1.9rem] w-[1.9rem] rounded-full flex items-center justify-center border-[1px] border-custom-light-2 active:scale-[.98]"
          onClick={() => {navigate("/") ; ; scrollToTop()}}
        >
          <p className="text-2xl mt-[-1px]">&#215;</p>
        </div>
        }

        {/* TV Shows */
        (!categoryParams || categoryParams === "t0") &&
        <div 
          className={`text-sm text-nowrap  py-1 px-3 rounded-full border-[1px] border-custom-light-2 active:scale-[.98]
            ${categoryParams === "t0" && "bg-[#868686] text-white pointer-events-none"}`} 
          onClick={() => {navigate("/browse/genre/t0") ; scrollToTop()}}
        >
          TV Shows
        </div>
        }
       
        {// Movie
        (!categoryParams || categoryParams === "m0") &&
        <div 
          className={`text-sm text-nowrap  py-1 px-3 rounded-full border-[1px] border-custom-light-2 active:scale-[.98]
            ${categoryParams === "m0" && "bg-[#868686] text-white pointer-events-none"}`} 
          onClick={() => {navigate("/browse/genre/m0") ; scrollToTop()}}
        >
          Movies
        </div>
        }
        
        <div className="text-sm text-nowrap  py-1 px-3 rounded-full border-[1px] border-custom-light-2 active:scale-[.98]">Categories &nbsp;v</div>
      </div>
    </nav>
  )
}
