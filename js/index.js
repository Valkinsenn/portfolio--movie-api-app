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
const moviePanel = document.querySelector(".panel")
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
        // console.log(element)

        setTimeout(() => {
          // Sets up the main movie element display:
          const movieElement = document.createElement("div")
          movieElement.classList.add(`movie`)
          if (element.release_date) {
            movieBoxDisplay.appendChild(movieElement)
          }

          // POSTER DISPLAY:
          const moviePoster = document.createElement("img")
          moviePoster.classList.add("movie-poster")
          movieElement.appendChild(moviePoster)
          moviePoster.src = `${imgPath}${element.poster_path}`

          // DETAILS DISPLAY:
          const movieDetails = document.createElement("div")
          movieDetails.classList.add(`movie-details`)
          movieElement.appendChild(movieDetails)

          // TITLE DISPLAY:
          const movieTitle = document.createElement("h2")
          movieTitle.classList.add("movie-title")
          movieDetails.appendChild(movieTitle)
          movieTitle.innerHTML = `${element.title}`
          // console.log(element.title)

          // DESCRIPTION DISPLAY:
          const movieDesc = document.createElement("div")
          movieDesc.classList.add("movie-description")
          movieDetails.appendChild(movieDesc)

          // YEAR DISPLAY:
          const movieYear = document.createElement("h3")
          movieYear.classList.add("movie-year")
          movieDesc.appendChild(movieYear)

          // IF THERE'S NO YEAR:
          if (element.release_date) {
            movieYear.innerHTML = `${dateFns.format(
              element.release_date,
              "YYYY"
            )}`
          } else {
            movieYear.innerHTML = `N/A`
          }

          // RATING BOX DISPLAY:
          const movieRatingBox = document.createElement("div")
          movieRatingBox.classList.add("movie-rating-box")
          movieDesc.appendChild(movieRatingBox)

          // RATING (OUT OF TEN):
          const movieRating = document.createElement("h4")
          movieRating.classList.add("movie-rating")
          movieRatingBox.appendChild(movieRating)
          movieRating.innerHTML = `<span>${element.vote_average}</span> / 10`

          // RATINGS AMOUNT:
          const movieRatingCount = document.createElement("h4")
          movieRatingCount.classList.add("movie-rating-count")
          movieRatingBox.appendChild(movieRatingCount)
          movieRatingCount.innerHTML = `${element.vote_count}`

          // CERTIFICATION:
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
                    if (date.certification) {
                      movieCert.innerHTML = `${date.certification}`
                    } else {
                      movieCert.innerHTML = `NR`
                    }
                  })
                }
              })
            })

          movieDesc.appendChild(movieCert)

          // GENRE COLLECTION:
          const movieGenreBox = document.createElement("div")
          movieGenreBox.classList.add("movie-genre-box")
          movieDetails.appendChild(movieGenreBox)

          // Info for genre tags:
          const genres = genresList
            .filter(object => element.genre_ids.includes(object.id))
            .map(item => item.name)

          // GENRE TAGS:
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

  // Sets up some movie search URLs:
  const movieSearchUrl = `https://api.themoviedb.org/3/movie/${elementId}?api_key=${apiKey}&language=en-US`

  const releaseDateUrl = `https://api.themoviedb.org/3/movie/${elementId}/release_dates?api_key=${apiKey}`

  // For movie rating:
  let movieRating;

  // Gets the movie's release date and certification:
  fetch(releaseDateUrl)
    .then(response => response.json())
    .then(data => {
      data.results.forEach(item => {
        if (item.iso_3166_1 === "US") {
          item.release_dates.forEach(date => {
            if (date.certification) {
              movieRating = `${date.certification}`
            } else {
              movieRating = `NR`
            }
          })
        }
      })
    })

  // Fetches the data:
  fetch(movieSearchUrl)
    .then(response => response.json())
    .then(data => {
      // For testing purposes:
      console.log(data)

      // Unhides the panel:
      movieCheckbox.checked = true

      // Function for converting runtime to hours and minutes:
      const timeConvert = (num) => {
        const number = num
        const hours = number / 60
        const rHours = Math.floor(hours)
        const minutes = (hours - rHours) * 60
        const rMinutes = Math.round(minutes)
        return `${rHours}h ${rMinutes}m`
      }

      // Getting the info for the genres panel:
      const genres = data.genres.map(genre => `<p class="panel-genre-tag">${genre.name}</p>`)

      console.log(genres);

      // Creates a panel to plug information into:
      const panelDetails = document.createElement("section")
      panelDetails.classList.add("panel-details")
      panelDetails.innerHTML = `
        <div class="panel-title-block">
          <h3>${data.title}</h3>
          <h4>${dateFns.format(data.release_date, "YYYY")} <span>•</span> ${movieRating} <span>•</span> ${timeConvert(data.runtime)}</h4>
        </div>
        <div class="panel-summary">
          <div class="panel-genres-block">
            ${genres.join(" ")}
          </div>
          <p class="summary">${data.overview}</p>
        </div>
        <div class="panel-rating-block">
          <h3><span>${data.vote_average}</span> / 10</h3>
          <h4>${data.vote_count}</h4>
        </div>
        <img class="panel-poster" src="${imgPath}${data.poster_path}">
      `

      // Attaches the details panel to the movie panel:
      moviePanel.appendChild(panelDetails)

      // Adds a blurred BG poster to the movie panel:
      const panelBgPoster = document.createElement("img")
      panelBgPoster.classList.add("panel-bg-poster")
      moviePanel.appendChild(panelBgPoster)
      panelBgPoster.src = `${imgPath}${data.poster_path}`


      // The close button for the pop-up modal:
      closeButton.addEventListener("click", () => {
        movieCheckbox.checked = false

        setTimeout(() => {
          panelBgPoster.remove()
          panelDetails.remove()
        }, 500)
      })
    })
}

// +++++++++++++++++++++++++++++++++++++++++++
// FUNCTION CALLERS
// +++++++++++++++++++++++++++++++++++++++++++

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
