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
  carteleraSection.scrollIntoView({ behavior: "smooth" }); //Scroll automático a la cartelera
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

// Botón cancelar añadir película
const btnCancelForm = document.getElementById("btn-close-cancel");
if (btnCancelForm) {
  btnCancelForm.addEventListener("click", function () {
    document.getElementById("movie-form").reset();
    console.log("Formulario cancelado");
    const addMovieModal = document.getElementById("add-movie-modal");
    addMovieModal.style.display = "none";
  });
}

// AÑADIR PELÍCULA
function createMovie() {
  openModal(); // Llama a la función existente apra abrir el modal
}

document.getElementById('movie-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Recopilar datos del formulario
    const movieData = {
        title: document.getElementById('title').value,
        director: document.getElementById('director').value,
        movie_description_es: document.getElementById('movie_description_es').value,
        year: document.getElementById('year').value,
        status: document.getElementById('status').value === 'visto', // convertir a booleano
        image: document.getElementById('movie-poster').value || '../src/assets/images/movie_placeholder.png', //  Imagen placeholder por defecto
        trailer: document.getElementById('movie-trailer').value
    };
    
    try {
        const response = await fetch('http://localhost:3000/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieData)
        });
        
        if (response.ok) {
            alert('Película añadida correctamente');
            closeModal();
            printMovies(); // Recargar la cartelera
        } else {
            alert('Error al añadir la película');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
});






//  MODAL FUNCION - gema
function openModal() {
  document.getElementById("add-movie-modal").style.display = "block";
}
function closeModal() {
  document.getElementById("add-movie-modal").style.display = "none";
  document.getElementById("movie-form").reset();
}
// ----Cerrar modal al hacer clic fuera
window.onclick = function (event) {
  const modal = document.getElementById("add-movie-modal");
  if (event.target == modal) {
    closeModal();
  }
};
