import searchIcon from "../../assets/images/icons/search.png"

type NavbarProps = {
  scrollDirection : string
  isAtTop : boolean
}

export const NavbarSmall = ( {scrollDirection, isAtTop} : NavbarProps ) => {
  // Username
  const userName : string = "Kharl"

  return (
    <nav className={`sm:hidden w-full py-4 px-5 fixed top-0 z-50 ${scrollDirection === "down" || !isAtTop && "navbar-glassmorphim"}`}>

      {/* Top Section */}
      <div className="flex justify-between items-center">
        <p className="text-white  font-semibold text-base">For {userName}</p>
        <img src={searchIcon} alt="Search Image" className="h-5"/>
      </div>

      {/* Bottom Section */}
      <div 
        className={
          `flex flex-wrap gap-x-2 gap-y-3 text-custom-light-2 overflow-hidden
          custom-transition-duration-3s ${scrollDirection === "down" || !isAtTop ? "h-0" : "mt-4 h-auto"}`
        }
      >
          <div className="text-sm text-nowrap  py-1 px-3 rounded-full border-[1px] border-custom-light-2 active:scale-[.98]">TV Shows</div>
          <div className="text-sm text-nowrap  py-1 px-3 rounded-full border-[1px] border-custom-light-2 active:scale-[.98]">Movies</div>
          <div className="text-sm text-nowrap  py-1 px-3 rounded-full border-[1px] border-custom-light-2 active:scale-[.98]">Categories &nbsp;v</div>
      </div>
    </nav>
  )
}
