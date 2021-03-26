import MySelectedMovies from './selected-movies.js';

const watchedLink = document.querySelector('[data-link="watched"]');
const watchlistLink = document.querySelector('[data-link="watchlist"]');
const favoritesLink = document.querySelector('[data-link="favorites"]');

const handleMovieState = (buttonValue, button, buttonsContainer, id) => {
  const selectedClass = 'card__button--selected';
  const allButtons = buttonsContainer.children;

  button.classList.toggle(selectedClass);

  const IsButtonSelected = button.classList.contains(selectedClass);

  const removeClassFromButton = (target) =>
    target.classList.remove(selectedClass);

  if (buttonValue === 'watched' && IsButtonSelected) {
    removeClassFromButton(allButtons[1]);

    MySelectedMovies.updateMovieState(id, buttonValue, true);
    MySelectedMovies.updateMovieState(id, 'watchlist', false);
  }

  if (buttonValue === 'watched' && !IsButtonSelected) {
    removeClassFromButton(allButtons[2]);

    MySelectedMovies.updateMovieState(id, buttonValue, false);
    MySelectedMovies.updateMovieState(id, 'favorite', false);
  }

  if (buttonValue === 'watchlist' && IsButtonSelected) {
    removeClassFromButton(allButtons[0]);
    removeClassFromButton(allButtons[2]);

    MySelectedMovies.updateMovieState(id, buttonValue, true);
    MySelectedMovies.updateMovieState(id, 'watched', false);
    MySelectedMovies.updateMovieState(id, 'favorite', false);
  }

  if (buttonValue === 'watchlist' && !IsButtonSelected) {
    MySelectedMovies.updateMovieState(id, buttonValue, false);
  }

  if (buttonValue === 'favorite' && IsButtonSelected) {
    allButtons[0].classList.add(selectedClass);

    removeClassFromButton(allButtons[1]);

    MySelectedMovies.updateMovieState(id, buttonValue, true);
    MySelectedMovies.updateMovieState(id, 'watched', true);
    MySelectedMovies.updateMovieState(id, 'watchlist', false);
  }

  if (buttonValue === 'favorite' && !IsButtonSelected) {
    MySelectedMovies.updateMovieState(id, buttonValue, false);
  }
};

const handleClicksOutsideHome = (activeLink) => {
  if (activeLink === 'watched') watchedLink.click();
  if (activeLink === 'watchlist') watchlistLink.click();
  if (activeLink === 'favorite') favoritesLink.click();
};

const handleOptions = (e, activeLink) => {
  const id = +e.currentTarget.parentNode.dataset.id;
  const buttonValue = e.target.dataset.button;
  const button = e.target;
  const buttonsContainer = e.currentTarget;

  handleMovieState(buttonValue, button, buttonsContainer, id);

  if (activeLink !== 'home') handleClicksOutsideHome(activeLink);
};

export default handleOptions;
