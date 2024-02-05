type SliderInfo = {
    componentType: "Slider" | "SliderTop10"
    title: string
    queryType: string
    queryKey: string
    classCount: number
  }

export const sliders: SliderInfo[] = [
    { componentType: "SliderTop10", title: "Top 10 TV Shows in the Philippines Today", queryType: "Top 10 TV Shows", queryKey: "top10TVshow", classCount: 0 },
    { componentType: "Slider", title: "Trending Now", queryType: "Trending Now", queryKey: "trendingNow", classCount: 1 },
    { componentType: "Slider", title: "US Movies", queryType: "US Movies", queryKey: "usMovies", classCount: 2 },
    { componentType: "SliderTop10", title: "Top 10 Movies in the Philippines Today", queryType: "Top 10 Movies", queryKey: "top10Movies", classCount: 3 },
    { componentType: "Slider", title: "Romantic Movies", queryType: "Romantic Movies", queryKey: "romanticMovies", classCount: 4 },
    { componentType: "Slider", title: "TV Action & Adventure", queryType: "TV Action & Adventure", queryKey: "tvActionAdventure", classCount: 5 },
    { componentType: "Slider", title: "Top Rated", queryType: "Top Rated Movies", queryKey: "topRated", classCount: 6 },
    { componentType: "Slider", title: "Popular on netflix", queryType: "Popular On Netflix TV", queryKey: "popularOnNetflix", classCount: 7 },
    { componentType: "Slider", title: "Documentaries", queryType: "Documentaries TV", queryKey: "documentary", classCount: 8 },
    { componentType: "Slider", title: "Western TV Sci-Fi & Fantasy", queryType: "Western TV Sci-Fi & Fantasy", queryKey: "westernTVSciFiFantasy", classCount: 9 },
    { componentType: "Slider", title: "Exciting Western Movies", queryType: "Exciting Western Movies", queryKey: "excitingWesternMovies", classCount: 10 },
    { componentType: "Slider", title: "Drama Movies", queryType: "Drama Movies", queryKey: "dramaMovies", classCount: 11 },
    { componentType: "Slider", title: "Watch for a While", queryType: "Watch for a While TV", queryKey: "watchForaWhile", classCount: 12 },
]