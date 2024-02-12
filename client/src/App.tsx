import { Routes, Route } from "react-router-dom"
import { Page } from "./pages/home/Page"
import { Page as Browse } from "./pages/browseItem/Page"
import { Page as Genre } from "./pages/genre/Page"
import { Page as Latest } from "./pages/latest/Page"
import { Page as Watch } from "./pages/watch/Page"
import { useAppStore } from "./store/ZustandStore"
import { useEffect, useState } from "react"
import { useRouteAndQueryParams } from "./utils/itemsFunction"
import { Page as SearchMobile } from "./pages/searchMobile/Page"

function App() {
  // Set Screen Width
  const { setScreenWidth, screenWidth, setPause, currentSection, setShowVideo } = useAppStore()
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [setScreenWidth])

  // Scrolling Detection
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0)
  const [scrollDirection, setScrollDirection] = useState<string>("")
  const [isAtTop, setIsAtTop] = useState<boolean>(true)
  
  // Triggered Navbar effect when the user is scrolling 
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset
      currentScrollPos > prevScrollPos ? setScrollDirection("down") : setScrollDirection("up")
      setPrevScrollPos(currentScrollPos)
      setIsAtTop(currentScrollPos === 0)
    }
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [prevScrollPos])

  // Params Url Getter
  const { params, categoryParams } = useRouteAndQueryParams()

  // Get search value params
  const urlParams = new URLSearchParams(window.location.search)
  const searchParams = urlParams.get("search")

  // Set video status if user in changing tab
  useEffect(() => {
    // Handler to call on visibility change
    const handleVisibilityChange = () => {
      // For video player in hero
      if (currentSection !== "categorySection") {
        if (document.hidden) { // Tab is inactive
          if (((!params && params === "Default") && !categoryParams) || (searchParams !== "1")) {
            setShowVideo(false)
            setPause(true)
          } 
        } 
        else { // Tab is active
          if ((searchParams && searchParams !== "1") || (!searchParams && !categoryParams && (!params || params === "Default"))) {
            setShowVideo(true)
            setPause(false)
          }
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    // Clean up
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [params, categoryParams, searchParams, currentSection])

  return (
    <>
      <Routes>
        {/* 
          * Main Page
          * Home Page
          */}
        <Route path="/" element={<Page scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>}/>
        {/* Item Modal */}
        <Route path="/browse/:category" element={screenWidth < 640 ? <Browse/> : <Page scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>}/>
        {/* Title Modal */}
        <Route path="/browse/m/genre/:categoryId/:genreId" element={screenWidth < 640 ? <Browse/> : <Page scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>}/>

        {/* 
          * Main Page
          * TV Show if t0 or Movie if m0
          */}
        <Route path="/browse/genre/:category" element={<Genre scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>}/>
        {/* Item Modal */}
        <Route path="/browse/genre/:category" element={screenWidth < 640 ? <Browse/> : <Genre scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>}/>
        {/* Title Modal */}
        <Route path="/browse/t/genre/:categoryId/:genreId" element={screenWidth < 640 ? <Browse/> : <Genre scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>}/>

        {/* 
          * Latest Page
          * New & Popular
          */}
        <Route path="/latest" element={<Latest scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>}/>
        {/* Item Modal */}
        <Route path="/browse/latest/:category" element={screenWidth < 640 ? <Browse/> : <Latest scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>}/>

        {/* 
          * Watch Page
          * Go to Iframe
          */}
        <Route path="/watch/:genreId/:trackId" element={<Watch/>}/>

        {/* For Mobile */}
        <Route path="/search" element={<SearchMobile/>}/>
      </Routes>
    </>
  )
}

export default App
