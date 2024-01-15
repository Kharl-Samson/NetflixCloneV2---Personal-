import { useAppStore } from "../store/ZustandStore"

export const videoEnded = () => {
    const { setVideoEnded, setShowVideo, setPlayAgain } = useAppStore.getState()

    setVideoEnded(true)
    setShowVideo(false)
    setPlayAgain(false)
}

export const videoEndedItems = () => {
    const { setVideoEndedItems, setShowVideoItems, setPlayAgainItems } = useAppStore.getState()

    setVideoEndedItems(true)
    setShowVideoItems(false)
    setPlayAgainItems(false)
}

