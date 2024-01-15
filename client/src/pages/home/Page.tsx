import { useEffect } from "react"
import { NavbarLarge } from "../../components/navbar/NavbarLarge"
import { NavbarMedium } from "../../components/navbar/NavbarMedium"
import { NavbarNormal } from "../../components/navbar/NavbarNormal"
import { NavbarSmall } from "../../components/navbar/NavbarSmall"
import { Slider } from "../../components/slider/Slider"
import { SliderTop10 } from "../../components/slider/SliderTop10"
import { useAppStore } from "../../store/ZustandStore"
import { getCurrentSection } from "../../utils/getCurrentSection"
import { Hero } from "./sections/Hero"

type NavbarProps = {
  scrollDirection : string
  isAtTop : boolean
}

export const Page = ( {scrollDirection, isAtTop} : NavbarProps ) => {
  // State from zustand
  const {screenWidth} = useAppStore()

  // Getting Active Section
  const activeSections = getCurrentSection()
  const { setCurrentSection } = useAppStore()
  useEffect(() => {
    setCurrentSection(activeSections)
  }, [activeSections])

  return (
    <div className="bg-custom-color-hero-1  overflow-hidden h-auto pb-[20rem]">
        
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

      <section id="categorySection">
        {/* Top 10 TV Shows */}
        <SliderTop10
          marginStyle = { 
            screenWidth < 640 ? "ml-5" : 
            screenWidth <= 800 ? "ml-7" : 
            screenWidth <= 950 ? "ml-7" : "ml-14"
          }
          sliderStyle = "sm:mt-[-14rem] sm:z-[40]"
          title = "Top 10 TV Shows in the Philippines Today"
          queryType = "Top 10 TV Shows"
          queryKey = "top10TVshow"
          classCount = {0}
        />

        {/* Trending Section */}
        <Slider
          marginStyle = { 
            screenWidth < 640 ? "ml-5" : 
            screenWidth <= 800 ? "ml-7" : 
            screenWidth <= 950 ? "ml-7" : "ml-14"
          }
          sliderStyle = "sm:mt-14 sm:z-[39]"
          title = "Trending Now"
          queryType = "Trending Now"
          queryKey = "trendingNow"
          classCount = {1}
        />

        {/* US Movies */}
        <Slider
          marginStyle = { 
            screenWidth < 640 ? "ml-5" : 
            screenWidth <= 800 ? "ml-7" : 
            screenWidth <= 950 ? "ml-7" : "ml-14"
          }
          sliderStyle = "sm:mt-14 sm:z-[38]"
          title = "US Movies"
          queryType = "US Movies"
          queryKey = "usMovies"
          classCount = {2}
        />

        {/* Top 10 Movies */}
        <SliderTop10
          marginStyle = { 
            screenWidth < 640 ? "ml-5" : 
            screenWidth <= 800 ? "ml-7" : 
            screenWidth <= 950 ? "ml-7" : "ml-14"
          }
          sliderStyle = "sm:mt-14 sm:z-[37]"
          title = "Top 10 Movies in the Philippines Today"
          queryType = "Top 10 Movies"
          queryKey = "top10Movies"
          classCount = {3}
        />

        {/* Romantic Movies */}
        <Slider
          marginStyle = { 
            screenWidth < 640 ? "ml-5" : 
            screenWidth <= 800 ? "ml-7" : 
            screenWidth <= 950 ? "ml-7" : "ml-14"
          }
          sliderStyle = "sm:mt-14 sm:z-[36]"
          title = "Romantic Movies"
          queryType = "Romantic Movies"
          queryKey = "romanticMovies"
          classCount = {4}
        />

        {/* Romantic Movies */}
        <Slider
          marginStyle = { 
            screenWidth < 640 ? "ml-5" : 
            screenWidth <= 800 ? "ml-7" : 
            screenWidth <= 950 ? "ml-7" : "ml-14"
          }
          sliderStyle = "sm:mt-14 sm:z-[35]"
          title = "TV Action & Adventure"
          queryType = "TV Action & Adventure"
          queryKey = "tvActionAdventure"
          classCount = {5}
        />
      </section>
    </div>
  )
}
