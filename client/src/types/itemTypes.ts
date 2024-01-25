// Types for my Item Container
export type ItemType = {
    id: string
    poster_path: string
    backdrop_path: string
    media_type : string
}
// Types for my Item Slider
export type ItemSliderProps = {
    itemHover : number | null
    index : number | null
    imageUrl : string
    trailerData : string
    isFetchedTrailer : boolean
    mediaType : string | boolean
    showDetails : {
      runtime : number
      number_of_seasons : number
      number_of_episodes : number
      genres : {
        name : string
      }[]
    }
    onMouseOver?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}