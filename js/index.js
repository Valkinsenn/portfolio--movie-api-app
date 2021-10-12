// The main JavaScript file for this website.

// +++++++++++++++++++++++++++++++++++++++++++
// API STUPH
// +++++++++++++++++++++++++++++++++++++++++++

const apiUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1`
const imgPath = `https://image.tmdb.org/t/p/w1280`
const searchApi = `https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=`

// +++++++++++++++++++++++++++++++++++++++++++
// DOM QUERIES
// +++++++++++++++++++++++++++++++++++++++++++

const movieBoxDisplay = document.querySelector("#display-box")
const searchForm = document.querySelector("#search-form")
const searchBox = document.querySelector("#search-box")

// +++++++++++++++++++++++++++++++++++++++++++
// MAIN CODE
// +++++++++++++++++++++++++++++++++++++++++++

// Function to fetch movies:
const showMovies = url => {
  fetch(url)
    .then(response => response.json())
    .then(data =>
      data.results.forEach(element => {
        console.log(element);

        // Sets up the main movie element display:
        const movieElement = document.createElement("div")
        movieElement.classList.add(`movie`)

        // Sets up the movie details display:
        const movieDetails = document.createElement("div")
        movieDetails.classList.add(`movie-details`)
        movieElement.appendChild(movieDetails)

        // Sets up some info to be plugged in:
        const movieTitle = document.createElement("h2")
        const moviePoster = document.createElement("img")

        // Plugs the data into its proper places:
        movieTitle.innerHTML = `${element.title}`
        moviePoster.src = `${imgPath}${element.poster_path}`

        // And finally weaves everything together:
        movieElement.appendChild(moviePoster)
        movieDetails.appendChild(movieTitle)
        movieBoxDisplay.appendChild(movieElement)
      })
    )
}

// Calls the showMovies function:
showMovies(apiUrl)

// Event listener for the movie search bar:
searchForm.addEventListener("submit", event => {
  event.preventDefault()
  movieBoxDisplay.innerHTML = ""

  // Sets up a searchTerm variable, then fills it with whatever's in the Search Box:
  const searchTerm = searchBox.value

  if (searchTerm) {
    showMovies(searchApi + searchTerm)
    searchBox.value = ""
  }
})
