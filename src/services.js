/*
Resumen de la Organización CRUD:
🟢 CREATE (Crear):
createMovie() - Abre el modal para crear
Event listener del formulario - Maneja crear Y actualizar

🟢 READ (Leer):
getMovies() - Obtiene datos de la API
printMovies() - Muestra la cartelera
showMovieInfo() - Muestra detalles de una película

🟢 UPDATE (Actualizar):
editMovie() - Abre el modal con datos prellenados
Event listener del formulario - Maneja crear Y actualizar

🟢 DELETE (Eliminar):
deleteMovie() - Elimina la película
*/

// READ Método GET
async function getMovies() {
  const response = await fetch("http://localhost:3000/movies");
  const moviedata = await response.json();
  return moviedata;
}

// Variable general para almacenar la película seleccionada
let selectedMovie = null;

// IMPRIMIR
let moviesContainer = document.getElementById("cartelera");
const carteleraSection = document.getElementById("cartelera-section");

async function printMovies() {
  const movies = await getMovies();
  carteleraSection.style.display = "block";
  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieImg = document.createElement("img");
    movieImg.src = movie.image;
    movieImg.alt = `${movie.title} movie poster`;
    movieImg.className = "img-cartelera";
    movieImg.style.cursor = "pointer";

    // Agregar evento click a cada imagen
    movieImg.addEventListener("click", () => {
      showMovieInfo(movie);
    });

    moviesContainer.appendChild(movieImg);
  });

  carteleraSection.scrollIntoView({ behavior: "smooth" }); //Scroll automático a la cartelera
}

// Función para mostrar información de la película
function showMovieInfo(movie) {
  selectedMovie = movie;
  const movieInfoSection = document.getElementById("movie-info");
  const movieDetailsDiv = document.getElementById("movie-details");

  // Ocultar cartelera
  carteleraSection.style.display = "none";

  // Crear el contenido de la película
  const movieDetails = `
    <div class="movie-details">
      <div class="movie-header">
        <img src="${movie.image}" alt="${
    movie.title
  } poster" class="movie-poster-detail">
        <div class="movie-info-text">
          <h2>${movie.title}</h2>
          ${movie.title_es ? `<h3>${movie.title_es}</h3>` : ""}
          <p><strong>Director:</strong> ${
            movie.director || "No especificado"
          }</p>
          <p><strong>Año:</strong> ${movie.year || "No especificado"}</p>
          <p><strong>Estado:</strong> ${
            movie.status ? "Visto" : "Pendiente"
          }</p>
          ${
            movie.genre
              ? `<p><strong>Género:</strong> ${movie.genre.join(", ")}</p>`
              : ""
          }
        </div>
      </div>
      ${
        movie.movie_description_es
          ? `<div class="movie-description"><p><strong>Descripción:</strong> ${movie.movie_description_es}</p></div>`
          : ""
      }
      ${
        movie.trailer
          ? `<div class="movie-trailer"><p><strong>Tráiler:</strong> <a href="${movie.trailer}" target="_blank">Ver tráiler</a></p></div>`
          : ""
      }
    </div>
  `;
  //el interrogante de L57 y L61 es un operador de If...else=> condición ? valor_si_verdadero : valor_si_falso

  // Reemplazar el contenido placeholder
  movieDetailsDiv.innerHTML = movieDetails;

  // Mostrar la sección
  movieInfoSection.style.display = "block";
  movieInfoSection.scrollIntoView({ behavior: "smooth" });
}

// Función para cerrar la información de la película
function closeMovieInfo() {
  document.getElementById("movie-info").style.display = "none";
  selectedMovie = null;
}

// --------------------EDITAR PELÍCULA------
function editMovie() {
  if (!selectedMovie) return;

  // Prellenar el formulario con los datos de la película
  document.getElementById("title").value = selectedMovie.title || "";
  document.getElementById("director").value = selectedMovie.director || "";
  document.getElementById("movie_description_es").value =
    selectedMovie.movie_description_es || "";
  document.getElementById("year").value = selectedMovie.year || "";
  document.getElementById("status").value = selectedMovie.status
    ? "visto"
    : "pendiente";
  document.getElementById("movie-poster").value = selectedMovie.image || "";
  document.getElementById("movie-trailer").value = selectedMovie.trailer || "";

  // Cambiar el modal a modo edición
  const modal = document.getElementById("movie-modal");
  const modalTitle = modal.querySelector("h2");
  if (modalTitle) {
    modalTitle.textContent = "Editar película";
  }

  // Mostrar el modal de edición
  modal.style.display = "block";
}

// Función para eliminar película
async function deleteMovie() {
  if (!selectedMovie) return;

  if (
    confirm(`¿Estás seguro de que quieres eliminar "${selectedMovie.title}"?`)
  ) {
    try {
      const response = await fetch(
        `http://localhost:3000/movies/${selectedMovie.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Película eliminada correctamente");
        closeMovieInfo();
        printMovies(); // Recargar la cartelera
      } else {
        alert("Error al eliminar la película");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  }
}

// Botones cerrar cartelera
const btnCloseList = document.querySelectorAll(".close");
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
    const addMovieModal = document.getElementById("movie-modal");
    addMovieModal.style.display = "none";
  });
}

// -------------------------AÑADIR PELÍCULA--------------
// AÑADIR PELÍCULA
function createMovie() {
  cleanModal(); // Limpiar el formulario
  
  // Cambiar título a "Añadir película"
  document.querySelector("#movie-modal h2").textContent = "Añadir película";
  selectedMovie = null; // Es para indicar que estamos creando, no editando, al no seleccionar nada
  
  openModal(); // Abrir el modal
}

document
  .getElementById("movie-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Recopilar datos del formulario
    const movieData = {
      title: document.getElementById("title").value,
      director: document.getElementById("director").value,
      movie_description_es: document.getElementById("movie_description_es")
        .value,
      year: document.getElementById("year").value,
      status: document.getElementById("status").value === "visto", // convertir a booleano
      image:
        document.getElementById("movie-poster").value || // imagen placeholder si no se ha añadido otra. OJO con la ruta!!!!
        "../src/assets/images/movie_placeholder.png",
      trailer: document.getElementById("movie-trailer").value,
    };

    try {
      // Determinar si es una actualización o creación nueva
      const isEditing = selectedMovie !== null;
      const url = isEditing
        ? `http://localhost:3000/movies/${selectedMovie.id}`
        : "http://localhost:3000/movies";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData),
      });

      if (response.ok) {
        alert(
          isEditing
            ? "Película actualizada correctamente"
            : "Película añadida correctamente"
        );
        closeModal();
        closeMovieInfo();
        printMovies(); // Recargar la cartelera
      } else {
        alert(
          isEditing
            ? "Error al actualizar la película"
            : "Error al añadir la película"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  });

// MODAL FUNCIONES
function openModal() {
  document.getElementById("movie-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("movie-modal").style.display = "none";
}

function cleanModal() {
  document.getElementById("movie-form").reset();
}

// Cerrar modal al hacer clic fuera del formulario
window.onclick = function (event) {
  const modalDiv = document.getElementById("movie-modal");
  if (event.target == modalDiv) {
    closeModal();
  }
};

// Ocultar sección movie-info por defecto
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("movie-info").style.display = "none";
});
