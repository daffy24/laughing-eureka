class Api {
    constructor() {
        this.apiKey = '27ea0ceb9dc161fded259817f0bfb236'; // Замініть на ваш API ключ
        this.baseUrl = 'https://api.themoviedb.org/3';
    }

    async fetchPopularMovies() {
        const response = await fetch(`${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=en-US&page=1`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.results;
    }
}

async function renderPopularMovies() {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block'; // Показати текст "Loading"

    const api = new Api();
    try {
        const movies = await api.fetchPopularMovies();
        loadingElement.remove(); // Приховати текст "Loading"

        const movieListElement = document.getElementById('movie-list');
        movies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');

            const poster = document.createElement('img');
            poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            poster.alt = movie.original_title;

            const title = document.createElement('h2');
            title.textContent = movie.original_title;

            movieItem.appendChild(poster);
            movieItem.appendChild(title);
            movieListElement.appendChild(movieItem);
        });
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        loadingElement.textContent = 'Failed to load movies.';
    }
}

// Виклик функції для рендерингу фільмів
renderPopularMovies();
