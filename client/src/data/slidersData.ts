type SliderInfo = {
    componentType: "Slider" | "SliderTop10"
    title: string
    queryType: string
    queryKey: string
    classCount: number
    sliderStyle : string
  }

export const sliders: SliderInfo[] = [
    { componentType: "SliderTop10", title: "Top 10 TV Shows in the Philippines Today", queryType: "Top 10 TV Shows", queryKey: "top10TVshow", classCount: 0, sliderStyle: "sm:mt-[-14rem] z-[40]" },
    { componentType: "Slider", title: "Trending Now", queryType: "Trending Now", queryKey: "trendingNow", classCount: 1, sliderStyle: "sm:mt-14 z-[39]" },
    { componentType: "Slider", title: "US Movies", queryType: "US Movies", queryKey: "usMovies", classCount: 2, sliderStyle: "sm:mt-14 z-[38]" },
    { componentType: "SliderTop10", title: "Top 10 Movies in the Philippines Today", queryType: "Top 10 Movies", queryKey: "top10Movies", classCount: 3, sliderStyle: "sm:mt-14 z-[37]" },
    { componentType: "Slider", title: "Romantic Movies", queryType: "Romantic Movies", queryKey: "romanticMovies", classCount: 4, sliderStyle: "sm:mt-14 z-[36]" },
    { componentType: "Slider", title: "TV Action & Adventure", queryType: "TV Action & Adventure", queryKey: "tvActionAdventure", classCount: 5, sliderStyle: "sm:mt-14 z-[35]" },
    { componentType: "Slider", title: "Top Rated", queryType: "Top Rated Movies", queryKey: "topRated", classCount: 6, sliderStyle: "sm:mt-14 z-[34]" },
    { componentType: "Slider", title: "Popular on netflix", queryType: "Popular On Netflix TV", queryKey: "popularOnNetflix", classCount: 7, sliderStyle: "sm:mt-14 z-[33]" },
    { componentType: "Slider", title: "Documentaries", queryType: "Documentaries TV", queryKey: "documentary", classCount: 8, sliderStyle: "sm:mt-14 z-[32]" },
    { componentType: "Slider", title: "Western TV Sci-Fi & Fantasy", queryType: "Western TV Sci-Fi & Fantasy", queryKey: "westernTVSciFiFantasy", classCount: 9, sliderStyle: "sm:mt-14 z-[31]" },
    { componentType: "Slider", title: "Exciting Western Movies", queryType: "Exciting Western Movies", queryKey: "excitingWesternMovies", classCount: 10, sliderStyle: "sm:mt-14 z-[30]" },
    { componentType: "Slider", title: "Drama Movies", queryType: "Drama Movies", queryKey: "dramaMovies", classCount: 11, sliderStyle: "sm:mt-14 z-[29]" },
    { componentType: "Slider", title: "Watch for a While", queryType: "Watch for a While TV", queryKey: "watchForaWhile", classCount: 12, sliderStyle: "sm:mt-14 z-[28]" },
    { componentType: "Slider", title: "Thrillers & Horror Movies", queryType: "Thrillers & Horror Movies", queryKey: "thrillersAndHorrorMovies", classCount: 13, sliderStyle: "sm:mt-14 z-[27]" },
    { componentType: "Slider", title: "Award-winning Western TV Comedies", queryType: "Award-winning Western TV Comedies", queryKey: "awardWinningWesternTvComedies", classCount: 14, sliderStyle: "sm:mt-14 z-[26]" }
]