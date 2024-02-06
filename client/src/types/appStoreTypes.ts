export type appStoreType = {
    screenWidth: number
    setScreenWidth: (value: number) => void
  
    myData: {
        id: string;
        backdrop_path?: string;
    }
    setMyData: (newData: {
        id: string;
        backdrop_path?: string;
    }) => void

    // React Youtube States -> Hero
    showVideo: boolean
    setShowVideo: (value: boolean) => void
    isMuted: boolean
    setIsMuted: (value: boolean) => void
    videoEnded: boolean
    setVideoEnded: (value: boolean) => void
    playAgain: boolean
    setPlayAgain: (value: boolean) => void
    pause: boolean
    setPause: (value: boolean) => void
  
    // React Youtube States -> Items
    showVideoItems: boolean
    setShowVideoItems: (value: boolean) => void
    isMutedItems: boolean
    setIsMutedItems: (value: boolean) => void
    videoEndedItems: boolean
    setVideoEndedItems: (value: boolean) => void
    playAgainItems: boolean
    setPlayAgainItems: (value: boolean) => void
    triggerAnimItems: boolean
    setTriggerAnimItems: (value: boolean) => void

    // React Youtube States -> Modal
    showVideoModal: boolean
    setShowVideoModal: (value: boolean) => void
    isMutedModal: boolean
    setIsMutedModal: (value: boolean) => void
    videoEndedModal: boolean
    setVideoEndedModal: (value: boolean) => void
    playAgainModal: boolean
    setPlayAgainModal: (value: boolean) => void
    pauseModal: boolean
    setPauseModal: (value: boolean) => void
  
    // React Youtube States -> Phone
    showVideoPhone: boolean
    setShowVideoPhone: (value: boolean) => void
    isMutedPhone: boolean
    setIsMutedPhone: (value: boolean) => void
    videoEndedPhone: boolean
    setVideoEndedPhone: (value: boolean) => void
    playAgainPhone: boolean
    setPlayAgainPhone: (value: boolean) => void
  
    // Items States
    trailerData: string
    setTrailerData: (value: string) => void
    videoId: string
    setVideoId: (value: string) => void
    showDetails: any
    setShowDetails: (value: any ) => void
  
    // Active Section and Article State
    currentSection: string | null
    setCurrentSection: (value: string | null) => void
    currentArticle: string | null
    setCurrentArticle: (value: string | null) => void
  
    // Modal States
    validModal: boolean,
    setValidModal: (value: boolean) => void
  
    // Search Click State
    isSearchClick: boolean
    setSearchClick: (value: boolean) => void
    searchValue: string
    setSearchValue: (value: string) => void
}