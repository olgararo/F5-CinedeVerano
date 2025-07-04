// CREATE Método POST
async function createMovie(newMovie) {
  // pendiente de implementar
}

// READ Método GET 
async function getMovies() {
  const result = await fetch('http://localhost:3000/movies');
  const data = await result.json();
  return data;
}

// UPDATE Método PUT
async function updateMovie(id, editedMovie) {
  // pendiente de implementar
}

// DELETE Método DELETE
async function deleteMovie(id) {
  // pendiente de implementar
}

// IMPRIMIR
let moviesContainer = document.querySelector('section');

async function printMovies() {
  const movies = await getMovies();
  const movieList = movies.map(movie => {
    return moviesContainer.innerHTML += 
    `<h1>${movie.title}</h1>
    <p>${movie.genre}</p>`;
  });

  return movieList;
}