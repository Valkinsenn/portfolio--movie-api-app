// The main JavaScript file for this website.

// +++++++++++++++++++++++++++++++++++++++++++
// API STUPH
// +++++++++++++++++++++++++++++++++++++++++++

const apiKey = `64eb5adfc85d8e838d751c3a4c23f914`
const apiUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}`
const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
const imgPath = `https://image.tmdb.org/t/p/w1280`
const searchApi = `https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=`

// +++++++++++++++++++++++++++++++++++++++++++
// DOM QUERIES
// +++++++++++++++++++++++++++++++++++++++++++

const movieBoxDisplay = document.querySelector("#display-box")
const resetButton = document.querySelector(`#site-logo`)
const searchForm = document.querySelector("#search-form")
const searchBox = document.querySelector("#search-box")

// +++++++++++++++++++++++++++++++++++++++++++
// GLOBAL VARIABLES
// +++++++++++++++++++++++++++++++++++++++++++

let genresList = []
let hasSearched = false

// +++++++++++++++++++++++++++++++++++++++++++
// MAIN CODE
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

  fetch(apiUrl)
    .then(response => response.json())
    .then(data =>
      data.results.forEach((element, i) => {
        // console.log(element);

        // Filters the list of genres by ID, then gets the name of each genre:
        const genres = genresList
          .filter(object => element.genre_ids.includes(object.id))
          .map(item => item.name)

        setTimeout(() => {
          // Sets up the main movie element display:
          const movieElement = document.createElement("div")
          movieElement.classList.add(`movie`)
  
          // Sets up the movie details display:
          const movieDetails = document.createElement("div")
          movieDetails.classList.add(`movie-details`)
          movieElement.appendChild(movieDetails)
  
          // Sets up the movie description:
          const movieDesc = document.createElement("p")
          movieDesc.classList.add('movie-description')

          // Sets up the genre collection:
          const movieGenreBox = document.createElement("div")
          movieGenreBox.classList.add('movie-genre-box')

          // Sets up the genre tags, then plugs them in:
          genres.map(item => {
            const genreTag = document.createElement("p")
            genreTag.classList.add('movie-genre-tag')
            genreTag.innerHTML = `${item}`

            movieGenreBox.appendChild(genreTag)
          })

          // Sets up the movie's title:
          const movieTitle = document.createElement("h2")
          movieTitle.classList.add('movie-title')

          // Sets up the movie's poster:
          const moviePoster = document.createElement("img")
          moviePoster.classList.add('movie-poster')
  
          // Plugs the data into its proper places:
          // movieGenreBox.innerHTML = `${genres}`
          movieTitle.innerHTML = `${element.title}`
          moviePoster.src = `${imgPath}${element.poster_path}`
  
          // Weaves everything together:
          movieElement.appendChild(moviePoster)
          movieDetails.appendChild(movieTitle)
          movieDetails.appendChild(movieDesc)
          movieDetails.appendChild(movieGenreBox)
          movieBoxDisplay.appendChild(movieElement)
        }, i * 100)

      })
    )
    .catch(error => {
      console.log(error)
    })
}

// Calls the getGenres function:
// getGenres(genreUrl)

// Calls the showMovies function:
showMovies(apiUrl, genreUrl)

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
  }
})

// Reset button:
resetButton.addEventListener("click", () => {
  if (hasSearched) {
    movieBoxDisplay.innerHTML = ``
    showMovies(apiUrl)
    hasSearched = false
  }
})