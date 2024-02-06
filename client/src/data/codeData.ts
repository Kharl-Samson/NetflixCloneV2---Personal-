type QueryCodes = {
    [key: string]: string |  null
}

// Query Type values in genre modal
export const queryTypeValues: QueryCodes = {
    "Trending Now": "Trending Now",
    "US Movies": "US Movies",
    "10749": "Discover",
    "10759": "Discover",
    "Top Rated Movies": "Top Rated Movies",
    "Popular On Netflix TV": "Popular On Netflix TV",
    "99": "Discover",
    "10765": "Discover",
    "37": "Discover",
    "18": "Discover",
    "80": "Discover",
    "27": "Discover",
    "35": "Discover"
}

// Query Type values in genre modal for title
export const queryTypeValuesTitle: QueryCodes = {
    "Trending Now": "Trending Now",
    "US Movies": "US Movies",
    "10749": "Romantic Movies",
    "10759": "TV Action & Adventure",
    "Top Rated Movies": "Top Rated",
    "Popular On Netflix TV": "Popular on Netflix",
    "99": "Documentaries",
    "10765": "Western TV Sci-Fi & Fantasy",
    "37": "Exciting Western Movies",
    "18": "Drama Movies",
    "80": "Watch for a While",
    "27": "Thrillers & Horror Movies",
    "35": "Award-winning Western TV Comedies"
}

type GenreCodes = {
    [key: string]: number | null
}

// Genre codes based on props
export const genreCodes: GenreCodes  = {
    "Romantic Movies": 10749,
    "TV Action & Adventure": 10759,
    "Documentaries TV": 99,
    "Western TV Sci-Fi & Fantasy": 10765,
    "Exciting Western Movies": 37,
    "Drama Movies": 18,
    "Watch for a While TV": 80,
    "Thrillers & Horror Movies": 27,
    "Award-winning Western TV Comedies": 35,
}