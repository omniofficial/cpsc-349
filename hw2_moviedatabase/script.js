const BASE_URL = "https://api.themoviedb.org/3/discover/movie";
const BEARER_TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmY2Q5MTE0ZDkxNjQxNDYyMWRmZDkwN2M0ZGRjOTRlZCIsIm5iZiI6MTc3MzAwNzk0Mi4zMzMsInN1YiI6IjY5YWRmNDQ2ODUzMTgyNDgzMDRlYjEyNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GplMZ8ZbFpH1Svdht9y9998mPJD233SNtJ8rtyVGvBw";

const pagesToLoad = 40;

let filteredMovies = [];
let allMovies = [];
let currentPage = 1;
const moviesPerPage = 20;
let totalPages = 1;

let sortValue = "&sort_by=popularity.desc";

// Button handlers / sort function calls
document.addEventListener("DOMContentLoaded", async () => {
    await fetchMultiplePages(pagesToLoad);
    renderCurrentPage();

    document.getElementById("next-btn").addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderCurrentPage();
        }
    });

    document.getElementById("previous-btn").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderCurrentPage();
        }
    });

    document.getElementById("search").addEventListener("input", searchMovies);

    // Sorting logic.
    document.getElementById("sort").addEventListener("change", async (e) => {
        switch (e.target.value) {
            case "release-asc":
                sortValue = "&sort_by=primary_release_date.asc";
                break;

            case "release-desc":
                sortValue = "&sort_by=primary_release_date.desc";
                break;

            case "rating-asc":
                sortValue = "&sort_by=vote_average.asc";
                break;

            case "rating-desc":
                sortValue = "&sort_by=vote_average.desc";
                break;
        }

        currentPage = 1;
        await fetchMultiplePages(pagesToLoad);
        renderCurrentPage();
    });
});

// Fetch multiple pages function. Using Bearer Token as seen in docs
async function fetchMultiplePages(pageCount) {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${BEARER_TOKEN}`,
        },
    };

    allMovies = [];

    for (let page = 1; page <= pageCount; page++) {
        const res = await fetch(
            `${BASE_URL}?include_adult=false&include_video=false&page=${page}${sortValue}`,
            options,
        );

        const data = await res.json();

        allMovies.push(
            ...data.results
                .filter((m) => m.poster_path) // Movies with poster only will be loaded
                .map((m) => ({
                    title: m.title,
                    image: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
                    releaseDate: m.release_date,
                    rating: m.vote_average,
                })),
        );
    }

    totalPages = Math.ceil(allMovies.length / moviesPerPage);
    filteredMovies = [...allMovies];
}

// Renders the current page the user is on with movies. Page 1, 2, etc.
function renderCurrentPage() {
    const container = document.getElementById("content-container");
    container.innerHTML = "";

    const startIndex = (currentPage - 1) * moviesPerPage;

    const pageMovies = filteredMovies.slice(
        startIndex,
        startIndex + moviesPerPage,
    );

    const grid = document.createElement("div");
    grid.classList.add("movies-grid");

    pageMovies.forEach((movie) => {
        const card = document.createElement("div");
        card.classList.add("movie-card");

        const img = document.createElement("img");
        img.src = movie.image;
        img.alt = movie.title;
        card.appendChild(img);

        const title = document.createElement("h3");
        title.textContent = movie.title;
        card.appendChild(title);

        const release = document.createElement("p");
        release.textContent = `Release Date: ${movie.releaseDate}`;
        card.appendChild(release);

        const rating = document.createElement("p");
        rating.textContent = `Rating: ${movie.rating}`;
        card.appendChild(rating);

        grid.appendChild(card);
    });

    container.appendChild(grid);

    document.querySelector(".page-info").textContent =
        `Page ${currentPage} of 55687`;
}

// Query through movies in filtered movies array.
function searchMovies() {
    const query = document.getElementById("search").value.toLowerCase();

    if (query === "") {
        filteredMovies = [...allMovies];
    } else {
        filteredMovies = allMovies.filter((movie) =>
            movie.title.toLowerCase().includes(query),
        );
    }

    currentPage = 1;
    totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
    renderCurrentPage();
}
