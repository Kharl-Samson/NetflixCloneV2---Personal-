import axios from "axios"

// Get Data List
export const getShowList = async(queryType: string, category : string | null, language?: string | null, genres?: number | null, page?: number) => {
  let url : string = ""
  switch (queryType) {
    case "Hero":
    case "Romantic Movies":
    case "TV Action & Adventure":
      url = `${import.meta.env.VITE_SERVER_URL}/discover/${category}`
      break
  
    case "Trending Now":
      url = `${import.meta.env.VITE_SERVER_URL}/trending/all/day`
      break
  
    case "Top 10 TV Shows":
    case "Top 10 Movies":
      url = `${import.meta.env.VITE_SERVER_URL}/trending/${category}/day`
      break
  
    case "US Movies":
      url = `${import.meta.env.VITE_SERVER_URL}/${category}/popular`
      break
  
    case "Top Rated Movies":
    case "Popular On Netflix TV":
      url = `${import.meta.env.VITE_SERVER_URL}/${category}/top_rated`
      break

    case "Documentaries TV":
    case "Western TV Sci-Fi & Fantasy":
    case "Exciting Western Movies":
    case "Drama Movies":
    case "Watch for a While TV":
      url = `${import.meta.env.VITE_SERVER_URL}/discover/${category}`
      break

    default:
      url = ""
      break
  }

  try {
    const response = await axios.get(url, {
      params: {
        api_key: import.meta.env.VITE_API_KEY,
        language: language,
        with_genres: genres,
        page: page
      },
      headers: {
        "Content-Type": "application/json"
      },
    })
    return response.data
  } catch (error : unknown | string) {
    console.log(error)
  }
}

// Get Trailer Details
export const getShowTrailer = async(category : string, trailerId: string | number) => {
  if(trailerId){
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/${category}/${trailerId}/videos`, {
        params: {
          api_key: import.meta.env.VITE_API_KEY
        },
        headers: {
          "Content-Type": "application/json"
        },
      })
      return response.data
    } catch (error : unknown | string) {
      console.log(error)
    }
  }
}

// Get Show Details
export const getShowDetails = async(category : string, trailerId: string | number, language?: string) => {
  if(trailerId){
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/${category}/${trailerId}`, {
        params: {
          api_key: import.meta.env.VITE_API_KEY,
          language: language
        },
        headers: {
          "Content-Type": "application/json"
        }
      })
      return response.data
    } catch (error : unknown | string) {
      console.log(error)
    }
  }
}

// Get Episodes Details if the Item is TV show
export const getEpisodeDetails = async(itemId: string, seasonNumber : number) => {
  if(seasonNumber){
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/tv/${itemId}/season/${seasonNumber}`, {
        params: {
          api_key: import.meta.env.VITE_API_KEY
        },
        headers: {
          "Content-Type": "application/json"
        }
      })
      return response.data
    } catch (error : unknown | string) {
      console.log(error)
    }
  }
}

// Get Similar Shows
export const getSimilarShows = async(category : string | null, itemId: string, page?: number) => {
  if(itemId){
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/${category}/${itemId}/recommendations`, {
        params: {
          api_key: import.meta.env.VITE_API_KEY,
          page: page
        },
        headers: {
          "Content-Type": "application/json"
        }
      })
      return response.data
    } catch (error : unknown | string) {
      console.log(error)
    }
  }
}

// Get Casts
export const getCasts = async(category : string, id: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/${category}/${id}/credits`, {
      params: {
        api_key: import.meta.env.VITE_API_KEY
      },
      headers: {
        "Content-Type": "application/json"
      },
    })
    return response.data
  } catch (error : unknown | string) {
    console.log(error)
  }
}

// Get Genres
export const getGenres = async(category : string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/genre/${category}/list`, {
      params: {
        api_key: import.meta.env.VITE_API_KEY
      },
      headers: {
        "Content-Type": "application/json"
      },
    })
    return response.data
  } catch (error : unknown | string) {
    console.log(error)
  }
}

// Get Items Collection
export const getCollections = async( collectionId: string) => {
  if(collectionId){
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/collection/${collectionId}`, {
        params: {
          api_key: import.meta.env.VITE_API_KEY
        },
        headers: {
          "Content-Type": "application/json"
        },
      })
      return response.data
    } catch (error : unknown | string) {
      console.log(error)
    }
  }
}

// Get Search Query
export const getSearchQuery = async( seaarchParam: string, page? : number) => {
  if(seaarchParam){
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/search/multi`, {
        params: {
          api_key: import.meta.env.VITE_API_KEY,
          query: seaarchParam,
          page: page
        },
        headers: {
          "Content-Type": "application/json"
        },
      })
      return response.data
    } catch (error : unknown | string) {
      console.log(error)
    }
  }
}
