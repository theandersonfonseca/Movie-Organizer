import createCard from './create-card.js';

const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const POPULAR_MOVIES = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`;

const cardsContainer = document.querySelector('[data-container]');
const search = document.querySelector('[data-search]');
const input = document.querySelector('[data-input]');
const alertMsg = document.querySelector('[data-alert]');
const homeLink = document.querySelector('[data-link="home"]');
const watchedLink = document.querySelector('[data-link="watched"]');
const watchlistLink = document.querySelector('[data-link="watchlist"]');
const favoritesLink = document.querySelector('[data-link="favorites"]');

let activeLink = 'home';

let searchedMovies = [];
let allMovies = [];
let watchedMovies = [];
let watchlistMovies = [];
let favoriteMovies = [];

const getDataFromLocalStorage = () => {
  allMovies = JSON.parse(localStorage.getItem('allMovies')) || [];
  watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];
  watchlistMovies = JSON.parse(localStorage.getItem('watchlistMovies')) || [];
  favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
};

const saveInLocalStorage = () => {
  localStorage.setItem('allMovies', JSON.stringify(allMovies));
  localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
  localStorage.setItem('watchlistMovies', JSON.stringify(watchlistMovies));
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
};

const updateDom = (list) => {
  cardsContainer.innerHTML = '';

  list.forEach((movie) =>
    cardsContainer.appendChild(
      createCard(
        movie.id,
        `${IMG_PATH}${movie.poster}`,
        movie.watched,
        movie.watchlist,
        movie.favorite
      )
    )
  );

  updateEventListeners();
};

const removeLinkClass = () => {
  [homeLink, watchedLink, watchlistLink, favoritesLink].forEach((link) =>
    link.classList.remove('menu__link--selected')
  );
};

const handleLinkClick = (event, linkValue, list) => {
  event.preventDefault();
  activeLink = linkValue;
  removeLinkClass();
  search.style.display = 'none';
  event.target.classList.add('menu__link--selected');
  updateDom(list);
};

watchedLink.addEventListener('click', (e) => {
  handleLinkClick(e, 'watched', watchedMovies);
});

watchlistLink.addEventListener('click', (e) => {
  handleLinkClick(e, 'watchlist', watchlistMovies);
});

favoritesLink.addEventListener('click', (e) => {
  handleLinkClick(e, 'favorites', favoriteMovies);
});

homeLink.addEventListener('click', (e) => {
  handleLinkClick(e, 'home', searchedMovies);
  search.style.display = 'block';

  if (searchedMovies.length === 0 && activeLink === 'home') {
    getPopularMovies();
  }
});

const getMovieIndex = (id) => {
  const allMoviesIndex = allMovies.findIndex((movie) => movie.id === id);
  const searchedMoviesIndex = searchedMovies.findIndex(
    (movie) => movie.id === id
  );

  return [allMoviesIndex, searchedMoviesIndex];
};

const changeMovieStatus = (list, index, property, value) => {
  list[index][property] = value;
};

const removeMovieFromFavoriteMovies = (
  allMoviesIndex,
  searchedMoviesIndex,
  watchedMoviesIndex,
  id
) => {
  favoriteMovies = favoriteMovies.filter((movie) => movie.id !== id);

  changeMovieStatus(allMovies, allMoviesIndex, 'favorite', false);
  changeMovieStatus(watchedMovies, watchedMoviesIndex, 'favorite', false);

  if (searchedMoviesIndex !== -1)
    changeMovieStatus(searchedMovies, searchedMoviesIndex, 'favorite', false);
};

const addInFavoriteMovies = (id) => {
  const [allMoviesIndex, searchedMoviesIndex] = [...getMovieIndex(id)];
  const watchedMoviesIndex = watchedMovies.findIndex(
    (movie) => movie.id === id
  );
  const isItToRemove = favoriteMovies.some((movie) => movie.id === id);

  if (isItToRemove) {
    removeMovieFromFavoriteMovies(
      allMoviesIndex,
      searchedMoviesIndex,
      watchedMoviesIndex,
      id
    );
    return;
  }

  watchlistMovies = watchlistMovies.filter((movie) => movie.id !== id);

  changeMovieStatus(allMovies, allMoviesIndex, 'favorite', true);
  changeMovieStatus(allMovies, allMoviesIndex, 'watched', true);
  changeMovieStatus(allMovies, allMoviesIndex, 'watchlist', false);

  if (searchedMoviesIndex !== -1) {
    changeMovieStatus(searchedMovies, searchedMoviesIndex, 'favorite', true);
    changeMovieStatus(searchedMovies, searchedMoviesIndex, 'watched', true);
    changeMovieStatus(searchedMovies, searchedMoviesIndex, 'watchlist', false);
  }

  if (activeLink === 'watched')
    watchedMovies[watchedMoviesIndex].favorite = true;

  if (watchedMovies.every((movie) => movie.id !== id)) {
    watchedMovies.push(allMovies[allMoviesIndex]);
  }

  favoriteMovies.push(allMovies[allMoviesIndex]);
};

const removeMovieFromWatchlistMovies = (
  allMoviesIndex,
  searchedMoviesIndex,
  id
) => {
  watchlistMovies = watchlistMovies.filter((movie) => movie.id !== id);

  changeMovieStatus(allMovies, allMoviesIndex, 'wachlist', false);

  if (searchedMoviesIndex !== -1) {
    changeMovieStatus(searchedMovies, searchedMoviesIndex, 'watchlist', false);
  }
};

const addInWatchlistMovies = (id) => {
  const [allMoviesIndex, searchedMoviesIndex] = [...getMovieIndex(id)];
  const isItToRemove = watchlistMovies.some((movie) => movie.id === id);

  if (isItToRemove) {
    removeMovieFromWatchlistMovies(allMoviesIndex, searchedMoviesIndex, id);
    return;
  }

  watchedMovies = watchedMovies.filter((movie) => movie.id !== id);

  changeMovieStatus(allMovies, allMoviesIndex, 'watchlist', true);
  changeMovieStatus(allMovies, allMoviesIndex, 'watched', false);
  changeMovieStatus(allMovies, allMoviesIndex, 'favorite', false);

  if (searchedMoviesIndex !== -1) {
    changeMovieStatus(searchedMovies, searchedMoviesIndex, 'watchlist', true);
    changeMovieStatus(searchedMovies, searchedMoviesIndex, 'watched', false);
    changeMovieStatus(searchedMovies, searchedMoviesIndex, 'favorite', false);
  }

  favoriteMovies = favoriteMovies.filter((movie) => movie.id !== id);

  watchlistMovies.push(allMovies[allMoviesIndex]);
};

const removeMovieFromWatchedMovies = (
  allMoviesIndex,
  searchedMoviesIndex,
  id
) => {
  watchedMovies = watchedMovies.filter((movie) => movie.id !== id);
  favoriteMovies = favoriteMovies.filter((movie) => movie.id !== id);

  changeMovieStatus(allMovies, allMoviesIndex, 'watched', false);
  changeMovieStatus(allMovies, allMoviesIndex, 'favorite', false);

  if (searchedMoviesIndex !== -1) {
    changeMovieStatus(searchedMovies, searchedMoviesIndex, 'watched', false);
    changeMovieStatus(searchedMovies, searchedMoviesIndex, 'favorite', false);
  }
};

const addInWatchedMovies = (id) => {
  const [allMoviesIndex, searchedMoviesIndex] = [...getMovieIndex(id)];
  const isItToRemove = watchedMovies.some((movie) => movie.id === id);

  if (isItToRemove) {
    removeMovieFromWatchedMovies(allMoviesIndex, searchedMoviesIndex, id);
    return;
  }

  watchlistMovies = watchlistMovies.filter((movie) => movie.id !== id);

  changeMovieStatus(allMovies, allMoviesIndex, 'watched', true);
  changeMovieStatus(allMovies, allMoviesIndex, 'watchlist', false);

  if (searchedMoviesIndex !== -1) {
    changeMovieStatus(searchedMovies, searchedMoviesIndex, 'watched', true);
    changeMovieStatus(searchedMovies, searchedMoviesIndex, 'watchlist', false);
  }

  watchedMovies.push(allMovies[allMoviesIndex]);
};

const handleClicksOutsideHome = () => {
  if (activeLink === 'watched') watchedLink.click();
  if (activeLink === 'watchlist') watchlistLink.click();
  if (activeLink === 'favorites') favoritesLink.click();
};

const removeUnselectedMovies = () => {
  allMovies = allMovies.filter((movie) => {
    if (!movie.watched && !movie.watchlist && !movie.favorite) {
      return false;
    }

    return true;
  });
};

const handleButtonState = (buttonValue, button, buttonsContainer) => {
  const selectedClass = 'card__button--selected';
  const allButtons = buttonsContainer.children;

  button.classList.toggle(selectedClass);

  const buttonHasSelectedClass = button.classList.contains(selectedClass);

  const removeClassFromButton = (target) =>
    target.classList.remove(selectedClass);

  if (buttonValue === 'watched' && buttonHasSelectedClass) {
    removeClassFromButton(allButtons[1]);
  }

  if (buttonValue === 'watched' && !buttonHasSelectedClass) {
    removeClassFromButton(allButtons[2]);
  }

  if (buttonValue === 'watchlist' && buttonHasSelectedClass) {
    removeClassFromButton(allButtons[0]);
    removeClassFromButton(allButtons[2]);
  }

  if (buttonValue === 'favorite' && buttonHasSelectedClass) {
    allButtons[0].classList.add(selectedClass);

    removeClassFromButton(allButtons[1]);
  }
};

const handleOptions = (e) => {
  const MOVIE_ID = +e.currentTarget.parentNode.dataset.id;
  const buttonValue = e.target.dataset.button;
  const button = e.target;
  const buttonsContainer = e.currentTarget;

  handleButtonState(buttonValue, button, buttonsContainer);

  if (allMovies.every((movie) => movie.id !== MOVIE_ID)) {
    const index = searchedMovies.findIndex((el) => el.id === MOVIE_ID);

    allMovies.push(searchedMovies[index]);
  }

  if (buttonValue === 'watched') addInWatchedMovies(MOVIE_ID);
  if (buttonValue === 'watchlist') addInWatchlistMovies(MOVIE_ID);
  if (buttonValue === 'favorite') addInFavoriteMovies(MOVIE_ID);

  if (activeLink !== 'home') handleClicksOutsideHome();

  removeUnselectedMovies();
  saveInLocalStorage();
};

const updateEventListeners = () => {
  const buttons = document.querySelectorAll('[data-buttons]');

  buttons.forEach((button) => button.addEventListener('click', handleOptions));
};

const isRepeated = (id, list) => list.some((movie) => movie.id === id);

const hasNoResult = (responseData) => {
  if (responseData.results.length === 0) {
    cardsContainer.innerHTML = '';

    alertMsg.classList.add('alert--show');
    cardsContainer.appendChild(alertMsg);

    return true;
  }

  return false;
};

const isInputValid = () => input.value.trim().length !== 0;

const checkMovieStatus = (id, list) => list.some((movie) => movie.id === id);

const pushMoviesIntoMoviesSearched = ({ id, poster_path }) => {
  searchedMovies.push({
    id,
    poster: poster_path,
    watched: checkMovieStatus(id, watchedMovies),
    watchlist: checkMovieStatus(id, watchlistMovies),
    favorite: checkMovieStatus(id, favoriteMovies),
  });
};

const searchMovies = async (e) => {
  e.preventDefault();
  searchedMovies = [];

  if (!isInputValid()) return;

  const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${input.value}&include_adult=false`;
  const response = await fetch(SEARCH_API);
  const responseData = await response.json();

  if (hasNoResult(responseData)) return;

  responseData.results.forEach((movie) => {
    if (movie.poster_path !== null && !isRepeated(movie.id, searchedMovies)) {
      pushMoviesIntoMoviesSearched(movie);
    }
  });

  updateDom(searchedMovies);
};

input.addEventListener('input', searchMovies);

const getPopularMovies = async () => {
  const response = await fetch(POPULAR_MOVIES);
  const responseData = await response.json();

  responseData.results.forEach((movie) => pushMoviesIntoMoviesSearched(movie));

  updateDom(searchedMovies);
};

export default (function init() {
  getPopularMovies();
  getDataFromLocalStorage();
})();
