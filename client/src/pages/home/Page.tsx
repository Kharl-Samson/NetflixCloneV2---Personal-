import { NavbarLarge } from "../../components/navbar/NavbarLarge"
import { NavbarMedium } from "../../components/navbar/NavbarMedium"
import { NavbarNormal } from "../../components/navbar/NavbarNormal"
import { NavbarSmall } from "../../components/navbar/NavbarSmall"
import { useAppStore } from "../../store/ZustandStore"
import { Hero } from "./sections/Hero"

type NavbarProps = {
  scrollDirection : string
  isAtTop : boolean
}

export const Page = ( {scrollDirection, isAtTop} : NavbarProps ) => {
  // State from zustand
  const {screenWidth} = useAppStore()
  
  return (
    <div className="bg-custom-color-hero-1">
        
      {// My Navigation
        screenWidth < 640 ?
          <NavbarSmall scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>
        :
        screenWidth <= 800 ?
          <NavbarMedium scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>
        :
        screenWidth <= 950 ?
          <NavbarNormal scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>
        :
          <NavbarLarge scrollDirection = {scrollDirection} isAtTop = {isAtTop} active = "Home"/>
      }

      {/* Hero Section */}
      <Hero/>
    </div>
  )
}
