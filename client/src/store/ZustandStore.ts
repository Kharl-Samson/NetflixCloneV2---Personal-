import { create } from 'zustand'

type appStore = {
  screenWidth: number
  setScreenWidth: (value: number) => void
}

const useAppStore = create<appStore>()(
  (set) => {
  return ({
    // Screen size
    screenWidth: window.innerWidth,
    setScreenWidth: (value: number) => set({ screenWidth: value })
  })
})


export { useAppStore }