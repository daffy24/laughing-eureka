class Api {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.themoviedb.org/3';
    }

    async fetchMoviesBySearchText(query) {
        const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }
}

const api = new Api('27ea0ceb9dc161fded259817f0bfb236');

const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');

searchInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query !== '') {
            const data = await api.fetchMoviesBySearchText(query);
            if (data && data.results.length > 0) {
                renderMovies(data.results, resultsContainer, data.total_results);
            } else {
                resultsContainer.innerHTML = `<p>No results for "${query}"</p>`;
            }
            searchInput.value = '';
        }
    }
});

function renderMovies(movies, container, totalResults) {
    container.innerHTML = `<h2>Results (${totalResults})</h2>`;
    const movieList = document.createElement('ul');
    movieList.className = 'movie-list';

    const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

    movies.forEach(movie => {
        const movieItem = document.createElement('li');
        movieItem.className = 'movie-item';

        const isSaved = savedMovies.includes(movie.id);

        movieItem.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Release Date: ${movie.release_date}</p>
            <button class="heart-button ${isSaved ? 'active' : ''}" data-id="${movie.id}">
                <i class="fas fa-heart"></i>
            </button>
        `;

        movieList.appendChild(movieItem);
    });

    container.appendChild(movieList);

    // Додаємо подію на кнопки "сердечко"
    document.querySelectorAll('.heart-button').forEach(button => {
        button.addEventListener('click', toggleSaveMovie);
    });
}
function toggleSaveMovie(event) {
    const button = event.currentTarget;
    const movieId = button.getAttribute('data-id');
    let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

    if (savedMovies.includes(movieId)) {
        // Видалити фільм із збережених
        savedMovies = savedMovies.filter(id => id !== movieId);
        button.classList.remove('active');
    } else {
        // Додати фільм до збережених
        savedMovies.push(movieId);
        button.classList.add('active');
    }

    localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
}

