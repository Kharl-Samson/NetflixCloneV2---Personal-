import axios from "axios"

// Get Data List
export const getShowList = async(queryType: string, category : string | null, language?: string | null, genres?: number | null, page?: number) => {
  let url : string = ""
  switch (queryType) {
    case "Hero":
    case "Romantic Movies":
    case "TV Action & Adventure":
    case "Documentaries TV":
    case "Western TV Sci-Fi & Fantasy":
    case "Exciting Western Movies":
    case "Drama Movies":
    case "Watch for a While TV":
    case "Thrillers & Horror Movies":
    case "Award-winning Western TV Comedies":
    case "Discover":
    case "Discover TV":
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
    case "Discover TV - Casual Viewing":
    case "Discover Movies - Casual Viewing":
      url = `${import.meta.env.VITE_SERVER_URL}/${category}/top_rated`
      break

    case "Discover TV - Recommendations":
    case "Discover Movies - Recommendations":
      url = `${import.meta.env.VITE_SERVER_URL}/${category}/121/recommendations`
      break

    case "Discover TV - Western TV Shows":
    case "Discover Movies - Western Movie Shows":
      url = `${import.meta.env.VITE_SERVER_URL}/discover/${category}`
      break

    case "Discover TV - New Releases":
    case "Discover Movies - New Releases":
      url = `${import.meta.env.VITE_SERVER_URL}/discover/${category}?first_air_date_year=2024`
      break

    case "Discover TV - Filipino TV Show":
    case "Discover Movies - Filipino Movies":
      url = `${import.meta.env.VITE_SERVER_URL}/discover/${category}?with_origin_country=ph`
      break

    case "Discover TV - Korean TV Show":
    case "Discover Movies - Korean Movies":
      url = `${import.meta.env.VITE_SERVER_URL}/discover/${category}?with_origin_country=kr`
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
    //console.log(error)
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
      //console.log(error)
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
      //console.log(error)
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
      //console.log(error)
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
      //console.log(error)
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
    //console.log(error)
  }
}

// Get Genres
export const getGenres = async(category : string | boolean) => {
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
    //console.log(error)
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
      //console.log(error)
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
      //console.log(error)
    }
  }
}
