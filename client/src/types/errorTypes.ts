import handlerError from "../assets/images/handlerError.png"

// Handling Image Error
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement
    target.onerror = null
    target.src = handlerError
}