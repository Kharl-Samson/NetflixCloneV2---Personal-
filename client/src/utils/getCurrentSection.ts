import { RefObject, useEffect, useState } from "react"

// Get current section
export const getCurrentSection = () => {
    const [currentSection, setCurrentSection] = useState<string | null>(null)
  
    const handleScroll = () => {
      const mainElement : NodeListOf<HTMLElement> = document.querySelectorAll("main")
      const scrollPosition = window.scrollY + window.innerHeight / 2
  
      for (const main of mainElement) {
        const top = main.offsetTop
        const height = main.offsetHeight
        
        if (scrollPosition >= top && scrollPosition <= top + height) {
          setCurrentSection(main.id)
          break
        }
        else{
          setCurrentSection(null)
          break
        }
      }
    }
  
    useEffect(() => {
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])
  
    return currentSection
}

// Get current article
export const getCurrentArticle = (scrollableArticleRef : RefObject<HTMLDivElement>) => {
  const [currentArticle, setCurrentArticle] = useState<string | null>(null)

  const handleScroll = () => {
    // Ensure the ref is current and has a value
    if (!scrollableArticleRef.current) {
      return
    }

    const mainElements = document.querySelectorAll("article")
    const scrollPosition = scrollableArticleRef.current.scrollTop + scrollableArticleRef.current.clientHeight / 2

    for (const main of mainElements) {
      const top = main.offsetTop - scrollableArticleRef.current.offsetTop
      const height = main.offsetHeight;
      if (scrollPosition >= top && scrollPosition <= top + height) {
        setCurrentArticle(main.id)
        return
      }
    }

    setCurrentArticle(null)
  }

  useEffect(() => {
    const scrollableDiv = scrollableArticleRef.current
    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll)
      return () => scrollableDiv.removeEventListener("scroll", handleScroll)
    }
  }, [scrollableArticleRef])

  return currentArticle
}

// Get Show runtime length if the category is movie
export const convertToHoursAndMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  return {
    hours,
    minutes: remainingMinutes
  }
}