import { Routes, Route } from "react-router-dom"
import { Page } from "./pages/home/Page"
import { useAppStore } from "./store/ZustandStore"
import { useEffect, useState } from "react"

function App() {
  // Set Screen Width
  const { setScreenWidth} = useAppStore()
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

  return (
    <>
      <Routes>
        {/* Main Pages */}
        <Route 
          path="/" 
          element={
            <Page scrollDirection = {scrollDirection} isAtTop = {isAtTop}/>
          }
        />
      </Routes>
    </>
  )
}

export default App
