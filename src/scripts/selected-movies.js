class SelectedMovies {
  constructor() {
    this.movies = [];
  }

  getDataFromLocalStorage() {
    this.movies = JSON.parse(localStorage.getItem('movies')) || [];
  }

  saveInLocalStorage() {
    localStorage.setItem('movies', JSON.stringify(this.movies));
  }

  getMovies() {
    return this.movies;
  }

  getMovie(id) {
    return this.movies.find((movie) => movie.id === id);
  }

  addMovie(movie) {
    this.movies.push(movie);

    this.saveInLocalStorage();
  }

  checkMovieStatus(id, property) {
    const movie = this.movies.find((movie) => movie.id === id);

    if (!movie) return false;

    return movie[property];
  }

  updateMovieState(id, property, value) {
    const index = this.movies.findIndex((movie) => movie.id === id);

    this.movies[index][property] = value;

    this.saveInLocalStorage();
  }

  clearUnselectedMovies() {
    this.movies = this.movies.filter((movie) => {
      if (!movie.watched && !movie.watchlist && !movie.favorite) {
        return false;
      }

      return true;
    });

    this.saveInLocalStorage();
  }

  isRepeated(id) {
    return this.movies.some((movie) => movie.id === id);
  }
}

const MySelectedMovies = new SelectedMovies();

export default MySelectedMovies;
