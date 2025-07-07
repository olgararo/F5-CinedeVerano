// READ Método GET 
async function getMovies() {
  const response = await fetch('http://localhost:3000/movies');
  const moviedata = await response.json();
  return moviedata;
}


// IMPRIMIR
let moviesContainer = document.getElementById('cartelera');

async function printMovies() {
  const movies = await getMovies();
  const movieList = movies.map((movie) => {
    return (moviesContainer.innerHTML += 
    `<img src="${movie.image}" alt="${movie.title} movie poster" class="img-cartelera">`);
  });

  return movieList;
}