import axios, { CancelToken } from "axios"

// Get Data List
export const getShowList = async (queryType: string, category : string | null, language?: string, genres?: number | null, page?: number) => {
  let url : string = ""
  switch(queryType){
    case "hero":
      url = `${import.meta.env.VITE_SERVER_URL}/discover/${category}`
      break
    case "trending now":
      url = `${import.meta.env.VITE_SERVER_URL}/trending/all/day`
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
const CancelToken = axios.CancelToken
const cancelTokenSource = CancelToken.source()
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
        },
        cancelToken: cancelTokenSource.token
      })
      return response.data
    } catch (error : unknown | string) {
      if (axios.isCancel(error)) {
        // Request was cancelled
      }
      else if (typeof error === 'string') {
        throw new Error(error)
      } else if (error instanceof Error) {
        throw error
      } else {
        throw new Error('An unknown error occurred.')
      }
    }
  }
}

// Cancel the request externally
export const cancelGetShowDetails = () => cancelTokenSource.cancel('Operation canceled')


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
