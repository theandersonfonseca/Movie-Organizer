import MySelectedMovies from './selected-movies.js';
import { updateDom, hasNoResult, handleLinkClick } from './handle-dom.js';

const search = document.querySelector('[data-search]');
const input = document.querySelector('[data-input]');
const homeLink = document.querySelector('[data-link="home"]');
const watchedLink = document.querySelector('[data-link="watched"]');
const watchlistLink = document.querySelector('[data-link="watchlist"]');
const favoritesLink = document.querySelector('[data-link="favorites"]');

const POPULAR_MOVIES = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`;

const returnMovieObject = (id, poster_path) => ({
  id,
  poster: poster_path,
  watched: MySelectedMovies.checkMovieStatus(id, 'watched'),
  watchlist: MySelectedMovies.checkMovieStatus(id, 'watchlist'),
  favorite: MySelectedMovies.checkMovieStatus(id, 'favorite'),
});

const pushMovieToMySelectedMovies = ({ id, poster_path }) => {
  MySelectedMovies.addMovie(returnMovieObject(id, poster_path));
};

const isInputValid = () => input.value.trim().length !== 0;

const getPopularMovies = async () => {
  MySelectedMovies.clearUnselectedMovies();

  const response = await fetch(POPULAR_MOVIES);
  const responseData = await response.json();

  const popularMovies = [];

  responseData.results.forEach(({ id, poster_path }) => {
    if (poster_path !== null && !MySelectedMovies.isRepeated(id)) {
      pushMovieToMySelectedMovies({ id, poster_path });
    }

    popularMovies.push(returnMovieObject(id, poster_path));
  });

  updateDom(popularMovies);
};

const searchMovies = async (e) => {
  e.preventDefault();
  MySelectedMovies.clearUnselectedMovies();

  if (!isInputValid()) {
    getPopularMovies();
    return;
  }

  const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${input.value}&include_adult=false`;
  const response = await fetch(SEARCH_API);
  const responseData = await response.json();

  if (hasNoResult(responseData)) return;

  const searchedMovies = [];

  responseData.results.forEach(({ id, poster_path }) => {
    if (poster_path !== null && !MySelectedMovies.isRepeated(id)) {
      pushMovieToMySelectedMovies({ id, poster_path });
    }

    if (poster_path !== null) {
      searchedMovies.push(returnMovieObject(id, poster_path));
    }
  });

  updateDom(searchedMovies);
};

export default (function init() {
  MySelectedMovies.getDataFromLocalStorage();
  getPopularMovies();

  search.addEventListener('input', searchMovies);

  watchedLink.addEventListener('click', (e) => {
    handleLinkClick(e, 'watched');
  });

  watchlistLink.addEventListener('click', (e) => {
    handleLinkClick(e, 'watchlist');
  });

  favoritesLink.addEventListener('click', (e) => {
    handleLinkClick(e, 'favorite');
  });

  homeLink.addEventListener('click', (e) => {
    handleLinkClick(e, 'home');
    search.style.display = 'block';
    input.value = '';

    getPopularMovies();
  });
})();
