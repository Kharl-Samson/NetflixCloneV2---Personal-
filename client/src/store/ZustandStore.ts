import { create } from 'zustand'
import { appStoreType } from '../types/appStoreTypes'

export const useAppStore = create<appStoreType>()(
  (set) => {

  // Get search value params
  const urlParams = new URLSearchParams(window.location.search)
  const sParam = urlParams.get("s")
  
  return ({
    // Screen size
    screenWidth: window.innerWidth,
    setScreenWidth: (value: number) => set({ screenWidth: value }),

    // My data state
    myData: { id: "" },
    setMyData: (newData) => set(() => ({ myData: newData })),

    // React Youtube States -> Hero
    showVideo: false,
    setShowVideo: (value: boolean) => set({ showVideo: value }),
    isMuted: true,
    setIsMuted: (value: boolean) => set({ isMuted: value }),
    videoEnded: false,
    setVideoEnded: (value: boolean) => set({ videoEnded: value }),
    playAgain: false,
    setPlayAgain: (value: boolean) => set({ playAgain: value }),
    pause: false,
    setPause: (value: boolean) => set({ pause: value }),

    // React Youtube States -> Items
    showVideoItems: false,
    setShowVideoItems: (value: boolean) => set({ showVideoItems: value }),
    isMutedItems: true,
    setIsMutedItems: (value: boolean) => set({ isMutedItems: value }),
    videoEndedItems: false,
    setVideoEndedItems: (value: boolean) => set({ videoEndedItems: value }),
    playAgainItems: false,
    setPlayAgainItems: (value: boolean) => set({ playAgainItems: value }),
    triggerAnimItems: false,
    setTriggerAnimItems: (value: boolean) => set({ triggerAnimItems: value }),

    // React Youtube States -> Modal
    showVideoModal: false,
    setShowVideoModal: (value: boolean) => set({ showVideoModal: value }),
    isMutedModal: true,
    setIsMutedModal: (value: boolean) => set({ isMutedModal: value }),
    videoEndedModal: false,
    setVideoEndedModal: (value: boolean) => set({ videoEndedModal: value }),
    playAgainModal: false,
    setPlayAgainModal: (value: boolean) => set({ playAgainModal: value }),
    pauseModal: false,
    setPauseModal: (value: boolean) => set({ pauseModal: value }),

    // React Youtube States -> Phone
    showVideoPhone: false,
    setShowVideoPhone: (value: boolean) => set({ showVideoPhone: value }),
    isMutedPhone: true,
    setIsMutedPhone: (value: boolean) => set({ isMutedPhone: value }),
    videoEndedPhone: false,
    setVideoEndedPhone: (value: boolean) => set({ videoEndedPhone: value }),
    playAgainPhone: false,
    setPlayAgainPhone: (value: boolean) => set({ playAgainPhone: value }),
    
    // Items States
    trailerData: "",
    setTrailerData: (value: string) => set({ trailerData: value }),
    videoId: "",
    setVideoId: (value: string) => set({ videoId: value }),
    showDetails: "",
    setShowDetails: (value: any) => set({ showDetails: value }),

    // Active Section and Article State
    currentSection: "",
    setCurrentSection: (value: string | null) => set({ currentSection: value }),
    currentArticle: "",
    setCurrentArticle: (value: string | null) => set({ currentArticle: value }),

    // Modal States
    validModal: true,
    setValidModal: (value: boolean) => set({ validModal: value }),

    // Search Click State
    isSearchClick: false,
    setSearchClick: (value: boolean) => set({ isSearchClick: value }),
    searchValue: sParam || "",
    setSearchValue: (value: string ) => set({ searchValue: value }),
  })
})
