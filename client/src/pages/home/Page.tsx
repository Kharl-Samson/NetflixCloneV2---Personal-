import { useEffect, useRef } from "react"
import { NavbarLarge } from "../../components/navbar/NavbarLarge"
import { NavbarMedium } from "../../components/navbar/NavbarMedium"
import { NavbarNormal } from "../../components/navbar/NavbarNormal"
import { NavbarSmall } from "../../components/navbar/NavbarSmall"
import { Slider } from "../../components/slider/Slider"
import { SliderTop10 } from "../../components/slider/SliderTop10"
import { useAppStore } from "../../store/ZustandStore"
import { getCurrentSection } from "../../utils/getCurrentSection"
import { Hero } from "./sections/Hero"
import { ShowsDetails } from "../../components/modals/showDetails/ShowsDetails"
import { useClickHandlers, useRouteAndQueryParams } from "../../utils/itemsFunction"
import { sliders } from "../../data/slidersData"

type NavbarProps = {
  scrollDirection : string
  isAtTop : boolean
}

export const Page = ( {scrollDirection, isAtTop} : NavbarProps ) => {
  // Params Url Getter
  const { params, categoryParams } = useRouteAndQueryParams()

  // State from zustand
  const {screenWidth} = useAppStore()

  // Getting Active Section
  const activeSections = getCurrentSection()
  const { setCurrentSection, showDetailsModal } = useAppStore()
  useEffect(() => {
    setCurrentSection(activeSections)
  }, [activeSections])

  // Closing Modal
  const modalRef = useRef<HTMLDivElement>(null)
  const { handleCloseModalOut } = useClickHandlers()
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const parentDiv = modalRef.current;
      const clickedElement = event.target as Node;
      parentDiv && parentDiv === clickedElement && handleCloseModalOut()  
    }
    document.body.addEventListener('click', handleClickOutside)
    return () => document.body.removeEventListener('click', handleClickOutside)
  }, [])

  // Scroll to bottom in modal ref
  const scrollToBottom = () => {
    if (modalRef.current) {
      modalRef.current.scrollTo({
        top: modalRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  // Function to determine margin style based on screen width
  const determineMarginStyle = (screenWidth: number) => {
    if (screenWidth < 640) return "ml-5"
    if (screenWidth <= 800) return "ml-7"
    if (screenWidth <= 950) return "ml-7"
    return "ml-14";
  }


  return (
    <section className="bg-custom-color-hero-1 overflow-hidden h-auto pb-[20rem]">
        
      {// My Navigation
        screenWidth < 640 ?
          <NavbarSmall scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>
        :
        screenWidth <= 800 ?
          <NavbarMedium scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>
        :
        screenWidth <= 1050 ?
          <NavbarNormal scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>
        :
          <NavbarLarge scrollDirection = {scrollDirection} isAtTop = {isAtTop} active = "Home"/>
      }

      {/* Hero Section */}
      <Hero/>

      <main id="categorySection">
        {sliders.map((slider, index : number) => {
          const CommonProps = {
            marginStyle: determineMarginStyle(screenWidth), 
            sliderStyle: `${index === 0 ? "sm:mt-[-14rem]" : "sm:mt-14"} sm:z-[${40 - index}]`,
            title: slider.title,
            queryType: slider.queryType,
            queryKey: slider.queryKey,
            classCount: slider.classCount
          }

          return slider.componentType === 'Slider' ? (
            <Slider {...CommonProps} key={slider.queryKey} />
          ) : (
            <SliderTop10 {...CommonProps} key={slider.queryKey} />
          )
        })}
      </main>

      {/* Modals - [Larger Screens] */
      ((screenWidth >= 640 && showDetailsModal) || (params && (categoryParams === "tv" || categoryParams === "movie"))) &&
        <div className="min-h-[100dvh] w-full fixed z-[1000] modal-background inset-0 overflow-y-scroll hidden sm:block" ref={modalRef}>
          <ShowsDetails scrollToBottom = {scrollToBottom} myRef = {modalRef}/>
        </div>
      }
    </section>
  )
}
