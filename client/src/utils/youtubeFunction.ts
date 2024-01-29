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

