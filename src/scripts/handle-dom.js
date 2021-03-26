import MySelectedMovies from './selected-movies.js';
import createCard from './create-card.js';
import handleOptions from './handle-movie-buttons.js';

const cardsContainer = document.querySelector('[data-container]');
const alertMsg = document.querySelector('[data-alert]');
const search = document.querySelector('[data-search]');
const homeLink = document.querySelector('[data-link="home"]');
const watchedLink = document.querySelector('[data-link="watched"]');
const watchlistLink = document.querySelector('[data-link="watchlist"]');
const favoritesLink = document.querySelector('[data-link="favorites"]');

let activeLink = 'home';

const hasNoResult = (responseData) => {
  if (responseData.results.length === 0) {
    cardsContainer.innerHTML = '';

    alertMsg.classList.add('alert--show');
    cardsContainer.appendChild(alertMsg);

    return true;
  }

  return false;
};

const updateEventListeners = () => {
  const buttons = document.querySelectorAll('[data-buttons]');

  buttons.forEach((button) =>
    button.addEventListener('click', (e) => handleOptions(e, activeLink))
  );
};

const updateDom = (movies) => {
  const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

  cardsContainer.innerHTML = '';

  movies.forEach(({ id, poster, watched, watchlist, favorite }) =>
    cardsContainer.appendChild(
      createCard(id, `${IMG_PATH}${poster}`, watched, watchlist, favorite)
    )
  );

  updateEventListeners();
};

const removeLinkClass = () => {
  [homeLink, watchedLink, watchlistLink, favoritesLink].forEach((link) =>
    link.classList.remove('menu__link--selected')
  );
};

const getFilteredMovies = (property) =>
  MySelectedMovies.getMovies().filter((movie) => movie[property] === true);

const handleLinkClick = (event, linkValue) => {
  event.preventDefault();

  activeLink = linkValue;
  removeLinkClass();
  search.style.display = 'none';
  event.target.classList.add('menu__link--selected');

  updateDom(getFilteredMovies(activeLink));
};

export { updateDom, updateEventListeners, hasNoResult, handleLinkClick };
