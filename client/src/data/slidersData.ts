type SliderInfo = {
    componentType: "Slider" | "SliderTop10"
    title: string
    queryType: string
    queryKey: string
    classCount: number
    sliderStyle : string
    genre?: number | null
}

// For Home Page
export const sliders: SliderInfo[] = [
    { 
      componentType: "SliderTop10", 
      title: "Top 10 TV Shows in the Philippines Today", 
      queryType: "Top 10 TV Shows", 
      queryKey: "top10TVshow", 
      classCount: 0, 
      sliderStyle: "sm:mt-[-14rem] z-[40]" 
    },
    { 
      componentType: "Slider", 
      title: "Trending Now", 
      queryType: "Trending Now", 
      queryKey: "trendingNow", 
      classCount: 1, 
      sliderStyle: "sm:mt-14 z-[39]",
      genre: null
    },
    { 
      componentType: "Slider", 
      title: "US Movies", 
      queryType: "US Movies", 
      queryKey: "usMovies", 
      classCount: 2, 
      sliderStyle: "sm:mt-14 z-[38]",
      genre: null 
    },
    { 
      componentType: "SliderTop10", 
      title: "Top 10 Movies in the Philippines Today", 
      queryType: "Top 10 Movies", 
      queryKey: "top10Movies", 
      classCount: 3, 
      sliderStyle: "sm:mt-14 z-[37]" 
    },
    { 
      componentType: "Slider", 
      title: "Romantic Movies",
      queryType: "Romantic Movies", 
      queryKey: "romanticMovies", 
      classCount: 4, 
      sliderStyle: "sm:mt-14 z-[36]",
      genre: 10749 
    },
    { 
      componentType: "Slider", 
      title: "TV Action & Adventure", 
      queryType: "TV Action & Adventure", 
      queryKey: "tvActionAdventure", 
      classCount: 5, 
      sliderStyle: "sm:mt-14 z-[35]",
      genre: 10759 
    },
    { 
      componentType: "Slider", 
      title: "Top Rated", 
      queryType: "Top Rated Movies", 
      queryKey: "topRated", 
      classCount: 6, 
      sliderStyle: "sm:mt-14 z-[34]",
      genre: null 
    },  
    {
      componentType: "Slider",
      title: "Popular on netflix",
      queryType: "Popular On Netflix TV",
      queryKey: "popularOnNetflix",
      classCount: 7,
      sliderStyle: "sm:mt-14 z-[33]",
      genre: null 
    },
    { 
      componentType: "Slider", 
      title: "Documentaries", 
      queryType: "Documentaries TV", 
      queryKey: "documentary", 
      classCount: 8, 
      sliderStyle: "sm:mt-14 z-[32]",
      genre: 99 
    },
    { 
      componentType: "Slider", 
      title: "Western TV Sci-Fi & Fantasy", 
      queryType: "Western TV Sci-Fi & Fantasy", 
      queryKey: "westernTVSciFiFantasy", 
      classCount: 9, 
      sliderStyle: "sm:mt-14 z-[31]",
      genre: 10765 
    },
    { 
      componentType: "Slider", 
      title: "Exciting Western Movies", 
      queryType: "Exciting Western Movies", 
      queryKey: "excitingWesternMovies", 
      classCount: 10, 
      sliderStyle: "sm:mt-14 z-[30]",
      genre: 37 
    },
    { 
      componentType: "Slider", 
      title: "Drama Movies", 
      queryType: "Drama Movies", 
      queryKey: "dramaMovies", 
      classCount: 11, 
      sliderStyle: "sm:mt-14 z-[29]",
      genre: 18 
    },
    { 
      componentType: "Slider", 
      title: "Watch for a While", 
      queryType: "Watch for a While TV", 
      queryKey: "watchForaWhile", 
      classCount: 12, 
      sliderStyle: "sm:mt-14 z-[28]",
      genre: 80 
    },
    { 
      componentType: "Slider", 
      title: "Thrillers & Horror Movies", 
      queryType: "Thrillers & Horror Movies", 
      queryKey: "thrillersAndHorrorMovies", 
      classCount: 13, 
      sliderStyle: "sm:mt-14 z-[27]",
      genre: 27 
    },
    { 
      componentType: "Slider", 
      title: "Award-winning Western TV Comedies", 
      queryType: "Award-winning Western TV Comedies", 
      queryKey: "awardWinningWesternTvComedies", 
      classCount: 14, 
      sliderStyle: "sm:mt-14 z-[26]",
      genre: 35 
    }
]

// For TV Page
export const slidersTV: SliderInfo[] = [
  { 
    componentType: "Slider", 
    title: "Trending Now", 
    queryType: "Top 10 TV Shows", 
    queryKey: "trendingNowTv", 
    classCount: 0, 
    sliderStyle: "sm:mt-14 z-[40]",
    genre: null
  },
  { 
    componentType: "Slider", 
    title: "Bingeworthy TV Shows", 
    queryType: "Discover TV - Recommendations", 
    queryKey: "bingeWorthyTvShows", 
    classCount: 1, 
    sliderStyle: "sm:mt-14 z-[39]",
    genre: null
  },
  { 
    componentType: "Slider", 
    title: "Casual Viewing", 
    queryType: "Discover TV - Casual Viewing", 
    queryKey: "casualViewing", 
    classCount: 2, 
    sliderStyle: "sm:mt-14 z-[38]",
    genre: null
  },
  { 
    componentType: "Slider", 
    title: "Western TV Shows", 
    queryType: "Discover TV - Western TV Shows", 
    queryKey: "westernTvShows", 
    classCount: 3, 
    sliderStyle: "sm:mt-14 z-[37]",
    genre: null
  },
  { 
    componentType: "SliderTop10", 
    title: "Top 10 TV Shows in the Philippines Today", 
    queryType: "Top 10 TV Shows", 
    queryKey: "top10TVshow", 
    classCount: 4, 
    sliderStyle: "sm:mt-14 z-[36]",
  },
  { 
    componentType: "Slider", 
    title: "New Releases", 
    queryType: "Discover TV - New Releases", 
    queryKey: "newReleases", 
    classCount: 5, 
    sliderStyle: "sm:mt-14 z-[35]",
    genre: null
  },
  { 
    componentType: "Slider", 
    title: "Filipino TV Shows", 
    queryType: "Discover TV - Filipino TV Show", 
    queryKey: "filipinoTvShows", 
    classCount: 6, 
    sliderStyle: "sm:mt-14 z-[34]",
    genre: null
  },
  { 
    componentType: "Slider", 
    title: "Korean TV Shows", 
    queryType: "Discover TV - Korean TV Show", 
    queryKey: "koreanTvShows", 
    classCount: 7, 
    sliderStyle: "sm:mt-14 z-[33]",
    genre: null
  },
]

// For Movies Page
export const slidersMovies: SliderInfo[] = [
  { 
    componentType: "Slider", 
    title: "Trending Now", 
    queryType: "Top 10 Movies", 
    queryKey: "trendingNowMovie", 
    classCount: 0, 
    sliderStyle: "sm:mt-14 z-[40]",
    genre: null
  },
  { 
    componentType: "Slider", 
    title: "Bingeworthy Movies", 
    queryType: "Discover Movies - Recommendations", 
    queryKey: "bingeWorthyMovies", 
    classCount: 1, 
    sliderStyle: "sm:mt-14 z-[39]",
    genre: null
  },
  { 
    componentType: "Slider", 
    title: "Casual Viewing", 
    queryType: "Discover Movies - Casual Viewing", 
    queryKey: "casualViewing", 
    classCount: 2, 
    sliderStyle: "sm:mt-14 z-[38]",
    genre: null
  },
  { 
    componentType: "Slider", 
    title: "Western Movies", 
    queryType: "Discover Movies - Western Movie Shows", 
    queryKey: "westernMoviesShows", 
    classCount: 3, 
    sliderStyle: "sm:mt-14 z-[37]",
    genre: null
  },
  { 
    componentType: "SliderTop10", 
    title: "Top 10 Movies in the Philippines Today", 
    queryType: "Top 10 Movies", 
    queryKey: "top10Movies", 
    classCount: 4, 
    sliderStyle: "sm:mt-14 z-[36]",
  },
  { 
    componentType: "Slider", 
    title: "New Releases", 
    queryType: "Discover Movies - New Releases", 
    queryKey: "newReleases", 
    classCount: 5, 
    sliderStyle: "sm:mt-14 z-[35]",
    genre: null
  },
  { 
    componentType: "Slider", 
    title: "Filipino Movies", 
    queryType: "Discover Movies - Filipino Movies", 
    queryKey: "filipinoMovies", 
    classCount: 6, 
    sliderStyle: "sm:mt-14 z-[34]",
    genre: null
  },
  { 
    componentType: "Slider", 
    title: "Korean Movies", 
    queryType: "Discover Movies - Korean Movies", 
    queryKey: "koreanMovies", 
    classCount: 7, 
    sliderStyle: "sm:mt-14 z-[33]",
    genre: null
  },
]

// For New & Popular Page
export const slidersLatest: SliderInfo[] = [
  { 
    componentType: "SliderTop10", 
    title: "Top 10 TV Shows in the Philippines Today", 
    queryType: "Top 10 TV Shows", 
    queryKey: "top10TVshow", 
    classCount: 0, 
    sliderStyle: "mt-[7rem] z-[39]",
  },
  { 
    componentType: "Slider", 
    title: "New TV Shows on Netflix", 
    queryType: "Discover TV - New Releases", 
    queryKey: "newOnNetflixTv", 
    classCount: 1, 
    sliderStyle: "sm:mt-14 z-[39]",
    genre: null
  },
  { 
    componentType: "SliderTop10", 
    title: "Top 10 Movies in the Philippines Today", 
    queryType: "Top 10 Movies", 
    queryKey: "top10Movies", 
    classCount: 2, 
    sliderStyle: "sm:mt-14 z-[38]" 
  },
  { 
    componentType: "Slider", 
    title: "New Movies on Netflix", 
    queryType: "Discover Movies - New Releases", 
    queryKey: "newOnNetflixMovies", 
    classCount: 3, 
    sliderStyle: "sm:mt-14 z-[37]",
    genre: null 
  },
  { 
    componentType: "Slider", 
    title: "Watch for a While", 
    queryType: "Discover TV - New Releases", 
    queryKey: "watchForaWhileLatest", 
    classCount: 4, 
    sliderStyle: "sm:mt-14 z-[36]",
    genre: 80 
  },
  { 
    componentType: "Slider", 
    title: "Bingeworthy TV Shows", 
    queryType: "Discover TV - New Releases", 
    queryKey: "tvActionAdventure", 
    classCount: 5, 
    sliderStyle: "sm:mt-14 z-[35]",
    genre: 10759 
  }
]