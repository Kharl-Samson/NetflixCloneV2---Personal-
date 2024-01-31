import { useAppStore } from "../store/ZustandStore"

export const videoEnded = () => {
    // Get search value params
    const urlParams = new URLSearchParams(window.location.search)
    const searchParams = urlParams.get("search")

    const { setVideoEnded, setShowVideo, setPlayAgain } = useAppStore.getState()

    searchParams !== "1" && setVideoEnded(true)
    searchParams !== "1" && setShowVideo(false)
    searchParams !== "1" && setPlayAgain(false)
}

export const videoEndedItems = () => {
    const { setVideoEndedItems, setShowVideoItems, setPlayAgainItems } = useAppStore.getState()

    setVideoEndedItems(true)
    setShowVideoItems(false)
    setPlayAgainItems(false)
}

export const videoEndedModal = () => {
    const { setVideoEndedModal, setShowVideoModal, setPlayAgainModal  } = useAppStore.getState()

    setVideoEndedModal(true)
    setShowVideoModal(false)
    setPlayAgainModal(false)
}

export const videoEndedPhone = () => {
    const { setVideoEndedPhone, setShowVideoPhone, setPlayAgainPhone  } = useAppStore.getState()

    setVideoEndedPhone(true)
    setShowVideoPhone(false)
    setPlayAgainPhone(false)
}

