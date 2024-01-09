import { create } from 'zustand'

type appStore = {
  screenWidth: number
  setScreenWidth: (value: number) => void

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
}

const useAppStore = create<appStore>()(
  (set) => {
  return ({
    // Screen size
    screenWidth: window.innerWidth,
    setScreenWidth: (value: number) => set({ screenWidth: value }),

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
  })
})


export { useAppStore }