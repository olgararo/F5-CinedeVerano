// READ Método GET
async function getMovies() {
  const response = await fetch("http://localhost:3000/movies");
  const moviedata = await response.json();
  return moviedata;
}

// IMPRIMIR
let moviesContainer = document.getElementById("cartelera");
const carteleraSection = document.getElementById("cartelera-section");

async function printMovies() {
  const movies = await getMovies();
  carteleraSection.style.display = "block";
  moviesContainer.innerHTML = "";
  const movieList = movies.map((movie) => {
    return (moviesContainer.innerHTML += `<img src="${movie.image}" alt="${movie.title} movie poster" class="img-cartelera">`);
  });

  return movieList;
}

// Botones cerrar cartelera
const btnCloseList = document.querySelectorAll(".close"); //a los 2 botones de cerrar les he añadido otra clase llamada close
btnCloseList.forEach((btnClose) => {
  if (btnClose) {
    btnClose.addEventListener("click", function () {
      const carteleraSection = document.getElementById("cartelera-section");
      carteleraSection.style.display = "none";
    });
  }
});
