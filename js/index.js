// The main JavaScript file for this website.

// +++++++++++++++++++++++++++++++++++++++++++
// API STUPH
// +++++++++++++++++++++++++++++++++++++++++++

const apiKey = `64eb5adfc85d8e838d751c3a4c23f914`
const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&certification_country=US&certification.gte=G&certification.lte=R&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
const imgPath = `https://image.tmdb.org/t/p/w1280`
const searchApi = `https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=`

// +++++++++++++++++++++++++++++++++++++++++++
// DOM QUERIES
// +++++++++++++++++++++++++++++++++++++++++++

const closeButton = document.querySelector(".close-button")
const movieCheckbox = document.querySelector("#display-checkbox")
const movieBoxDisplay = document.querySelector("#display-box")
const moviePanel = document.querySelector(".movie-panel")
const pageContent = document.querySelector(".page-content")
const resetButton = document.querySelector(`#site-logo`)
const searchForm = document.querySelector("#search-form")
const searchBox = document.querySelector("#search-box")

// +++++++++++++++++++++++++++++++++++++++++++
// GLOBAL VARIABLES
// +++++++++++++++++++++++++++++++++++++++++++

let genresList = []
let hasSearched = false

// +++++++++++++++++++++++++++++++++++++++++++
// FUNCTIONS
// +++++++++++++++++++++++++++++++++++++++++++

// Function to fetch genres:
const getGenres = async url => {
  fetch(url)
    .then(response => response.json())
    .then(data =>
      data.genres.forEach(genre => {
        return genresList.push(genre)
      })
    )
    .catch(error => {
      console.log(error)
    })
}

// Function to fetch movies (and genres, WIP):
const showMovies = async (apiUrl, genreUrl) => {
  // Gets the list of genres to be checked later:
  fetch(genreUrl)
    .then(response => response.json())
    .then(data =>
      data.genres.forEach(genre => {
        return genresList.push(genre)
      })
    )
    .catch(error => {
      console.log(error)
    })

  // Gets movies:
  fetch(apiUrl)
    .then(response => response.json())
    .then(data =>
      data.results.forEach((element, i) => {
        // For testing purposes:
        console.log(element)

        // Filters the list of genres by ID, then gets the name of each genre:
        const genres = genresList
          .filter(object => element.genre_ids.includes(object.id))
          .map(item => item.name)

        setTimeout(() => {
          // Sets up the main movie element display:
          const movieElement = document.createElement("div")
          movieElement.classList.add(`movie`)
          if (element.release_date) {
            movieBoxDisplay.appendChild(movieElement)
          }

          // Sets up the movie's poster:
          const moviePoster = document.createElement("img")
          moviePoster.classList.add("movie-poster")
          movieElement.appendChild(moviePoster)
          moviePoster.src = `${imgPath}${element.poster_path}`

          // In case the poster doesn't load:
          moviePoster.addEventListener("error", () => {
            console.log(`Well, shit! I didn't load! :'(`)
          })

          // Sets up the movie details display:
          const movieDetails = document.createElement("div")
          movieDetails.classList.add(`movie-details`)
          movieElement.appendChild(movieDetails)

          // Sets up the movie's title:
          const movieTitle = document.createElement("h2")
          movieTitle.classList.add("movie-title")
          movieDetails.appendChild(movieTitle)
          movieTitle.innerHTML = `${element.title}`
          // console.log(element.title)

          // Sets up the movie description:
          const movieDesc = document.createElement("div")
          movieDesc.classList.add("movie-description")
          movieDetails.appendChild(movieDesc)

          // Sets up the movie's year in the description:
          const movieYear = document.createElement("h3")
          movieYear.classList.add("movie-year")
          movieDesc.appendChild(movieYear)

          // Sometimes, movies don't have a year.
          // This is for correcting that little error:
          if (element.release_date) {
            movieYear.innerHTML = `${dateFns.format(
              element.release_date,
              "YYYY"
            )}`
          } else {
            movieYear.innerHTML = `N/A`
          }

          // Sets up the movie's rating box in the description:
          const movieRatingBox = document.createElement("div")
          movieRatingBox.classList.add("movie-rating-box")
          movieDesc.appendChild(movieRatingBox)

          // Sets up the movie's actual rating (out of ten):
          const movieRating = document.createElement("h4")
          movieRating.classList.add("movie-rating")
          movieRatingBox.appendChild(movieRating)
          movieRating.innerHTML = `<span>${element.vote_average}</span> / 10`

          // Sets up the movie's rating count:
          const movieRatingCount = document.createElement("h4")
          movieRatingCount.classList.add("movie-rating-count")
          movieRatingBox.appendChild(movieRatingCount)
          movieRatingCount.innerHTML = `${element.vote_count}`

          // Sets up the movie's certification:
          const releaseDateUrl = `https://api.themoviedb.org/3/movie/${element.id}/release_dates?api_key=${apiKey}`
          const movieCert = document.createElement("h3")
          movieCert.classList.add("movie-cert")

          fetch(releaseDateUrl)
            .then(response => response.json())
            .then(data => {
              // console.log(data)

              data.results.forEach(item => {
                if (item.iso_3166_1 === "US") {
                  item.release_dates.forEach(date => {
                    // console.log(date)

                    if (date.certification) {
                      movieCert.innerHTML = `${date.certification}`
                    } else if (
                      !date.certification ||
                      date.certification == ""
                    ) {
                      movieCert.innerHTML = `NR`
                    }
                  })
                }
              })
            })

          movieDesc.appendChild(movieCert)

          // Sets up the genre collection:
          const movieGenreBox = document.createElement("div")
          movieGenreBox.classList.add("movie-genre-box")
          movieDetails.appendChild(movieGenreBox)

          // Sets up the genre tags, then plugs them in:
          genres.map(item => {
            const genreTag = document.createElement("p")
            genreTag.classList.add("movie-genre-tag")
            genreTag.innerHTML = `${item}`

            movieGenreBox.appendChild(genreTag)
          })

          // Adds a click event listener to each title:
          movieTitle.addEventListener("click", () => {
            fetchMovie(element.id)
          })
        }, i * 100)
      })
    )
    .catch(error => {
      console.log(error)
    })
}

// Function to get a single movie:
const fetchMovie = elementId => {
  const movieSearchUrl = `https://api.themoviedb.org/3/movie/${elementId}?api_key=${apiKey}&language=en-US`

  const releaseDateUrl = `https://api.themoviedb.org/3/movie/${elementId}/release_dates?api_key=${apiKey}`

  // For movie ratings
  let movieRating = ""

  // Gets the movie's release date and certification:
  fetch(releaseDateUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })

  // For testing purposes.
  // console.log(`You clicked me! My ID is: ${elementId}. You can search for me at ${movieSearchUrl}`);

  // Fetches the data for a single movie:
  fetch(movieSearchUrl)
    .then(response => response.json())
    .then(data => {
      // For testing purposes:
      console.log(data)

      // Unhides the panel:
      movieCheckbox.checked = true

      // Creates a panel to plug information into:
      const panelDetails = document.createElement("section")
      panelDetails.classList.add("movie-panel-details")
      panelDetails.innerHTML = `
        <img class="panel-poster" src="${imgPath}${data.poster_path}">
        <div class="panel-title-block">
          <h3>${data.title}</h3>
          <h4>${dateFns.format(data.release_date, "YYYY")}</h4>
        </div>
      `
      moviePanel.appendChild(panelDetails)

      // Closes the panel down:
      closeButton.addEventListener("click", () => {
        movieCheckbox.checked = false

        setTimeout(() => {
          panelDetails.remove()
        }, 500)
      })
    })
}

// +++++++++++++++++++++++++++++++++++++++++++
// FUNCTION CALLERS
// +++++++++++++++++++++++++++++++++++++++++++

// Calls the getGenres function:
// getGenres(genreUrl)

// Calls the showMovies function:
showMovies(apiUrl, genreUrl)

// +++++++++++++++++++++++++++++++++++++++++++
// EVENT LISTENERS
// +++++++++++++++++++++++++++++++++++++++++++

// Event listener for the movie search bar:
searchForm.addEventListener("submit", event => {
  event.preventDefault()

  // Sets up a searchTerm variable, then fills it with whatever's in the Search Box:
  const searchTerm = searchBox.value

  if (searchTerm) {
    movieBoxDisplay.innerHTML = ""
    showMovies(searchApi + searchTerm)
    searchBox.value = ""

    if (!hasSearched) {
      hasSearched = true
    }

    // setTimeout(() => {
    //   console.clear()
    // }, 100)
  }
})

// Reset button:
resetButton.addEventListener("click", () => {
  if (hasSearched) {
    movieBoxDisplay.innerHTML = ``
    showMovies(apiUrl)
    hasSearched = false

    // setTimeout(() => {
    //   console.clear()
    // }, 100)
  }
})
