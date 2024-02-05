// Types for my Item Container
export type ItemType = {
    id: string
    title? : string
    name? : string
    original_title? : string
    poster_path: string
    backdrop_path: string
    media_type : string
    vote_count : string
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
      id?: string
      runtime : number
      number_of_seasons : number
      number_of_episodes : number
      genres : {
        name : string
      }[]
    }
    onMouseOver?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}