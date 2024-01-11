import axios from "axios"

// Get Data List
export const getShowList = async (queryType: string, category : string | null, language?: string, genres?: number | null, page?: number) => {
  let url : string = ""
  switch(queryType){
    case "Hero":
      url = `${import.meta.env.VITE_SERVER_URL}/discover/${category}`
      break
    case "Trending Now":
      url = `${import.meta.env.VITE_SERVER_URL}/trending/all/day`
      break
    case "Top 10 TV Shows":
      url = `${import.meta.env.VITE_SERVER_URL}/trending/${category}/day`
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
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (error : unknown | string) {
    if (typeof error === 'string') {
      throw new Error(error)
    } else if (error instanceof Error) {
      throw error
    } else {
      throw new Error('An unknown error occurred.')
    }
  }
}

// Get Trailer Details
export const getShowTrailer = async (category : string, trailerId: string | number) => {
  if(trailerId){
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/${category}/${trailerId}/videos`, {
        params: {
          api_key: import.meta.env.VITE_API_KEY
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error : unknown | string) {
      if (typeof error === 'string') {
        throw new Error(error)
      } else if (error instanceof Error) {
        throw error
      } else {
        throw new Error('An unknown error occurred.');
      }
    }
  }
}

// Get Show Details
export const getShowDetails = async (category : string, trailerId: string | number, language?: string) => {
  if(trailerId){
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/${category}/${trailerId}`, {
        params: {
          api_key: import.meta.env.VITE_API_KEY,
          language: language
        },
        headers: {
          'Content-Type': 'application/json',
        }
      })
      return response.data
    } catch (error : unknown | string) {
      if (typeof error === 'string') {
        throw new Error(error)
      } else if (error instanceof Error) {
        throw error
      } else {
        throw new Error('An unknown error occurred.')
      }
    }
  }
}

// Get Genres
export const getGenres = async (category : string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/genre/${category}/list`, {
      params: {
        api_key: import.meta.env.VITE_API_KEY,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (error : unknown | string) {
    if (typeof error === 'string') {
      throw new Error(error)
    } else if (error instanceof Error) {
      throw error
    } else {
      throw new Error('An unknown error occurred.')
    }
  }
}
