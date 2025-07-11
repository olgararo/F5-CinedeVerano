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

// ============================================
// VARIABLES GLOBALES
// ============================================
let selectedMovie = null;
const moviesContainer = document.getElementById("cartelera");
const carteleraSection = document.getElementById("cartelera-section");

// ============================================
// CRUD: CREATE (Crear películas) - Botón "Añadir película"
// ============================================

// Función para abrir modal en modo crear
function createMovie() {
  cleanModal(); // Limpiar el formulario
  document.querySelector("#movie-modal h2").textContent = "Añadir película"; // Cambiar título a "Añadir película"
  selectedMovie = null; // Indicar que estamos creando, no editando, al no seleccionar ninguna película
  closeMovieInfo(); // Cerrar la sección movie-info si está abierta
  openModal(); // Abrir el modal
}

// Gestionar envío del formulario (crear o actualizar)
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
        document.getElementById("movie-poster").value ||
        "../src/assets/images/movie_placeholder.png", // En caso de no haber imágenes, pone la imagen placeholder que he diseñado y subido al repo
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

// ============================================
// CRUD: READ (Leer/Obtener películas) - Traer las pelis disponibles del json. y mostrarlas todas o una específica
// ============================================

// Obtener películas de la API
async function getMovies() {
  const response = await fetch("http://localhost:3000/movies");
  const moviedata = await response.json();
  return moviedata;
}

// Mostrar todas las películas en la cartelera
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

// Mostrar información detallada de una película
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

  // Reemplazar el contenido placeholder
  movieDetailsDiv.innerHTML = movieDetails;

  // Mostrar la sección
  movieInfoSection.style.display = "block";
  movieInfoSection.scrollIntoView({ behavior: "smooth" });
}

// ============================================
// CRUD: UPDATE (Actualizar películas) - Si ahy alguna película seleccionada, prerrellena el form con la info disponible
// ============================================

// Función para editar película (prellenar formulario)
function editMovie() {
  if (!selectedMovie) return; //Si no hay película seleccionada, para aquí la función

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
  document.querySelector("#movie-modal h2").textContent = "Editar película";

  // Mostrar el modal de edición
  document.getElementById("movie-modal").style.display = "block";
}

// ============================================
// CRUD: DELETE (Eliminar películas)
// ============================================

// Función para eliminar película
async function deleteMovie() {
  if (!selectedMovie) return; //Si no hay película seleccionada, para aquí la función

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

// ============================================
// FUNCIONES DE INTERFAZ - MODAL Formulario
// ============================================

// Funciones del modal
function openModal() {
  document.getElementById("movie-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("movie-modal").style.display = "none";
}

function cleanModal() {
  document.getElementById("movie-form").reset();
}

// Función para cerrar la información de la película
function closeMovieInfo() {
  document.getElementById("movie-info").style.display = "none";
  selectedMovie = null;
}

// ============================================
// EVENT LISTENERS - clicks en botones de cerrar, cancelar o clicar fuera
// ============================================

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
