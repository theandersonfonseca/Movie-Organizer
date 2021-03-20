const createCard = (id, imageSrc, watched, watchlist, favorite) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('data-id', `${id}`);

  card.innerHTML = `
                    <img class="card__image" src="${imageSrc}" alt="poster do filme" data-image>

                    <div class="card__buttons" data-buttons>
                      <button class="${
                        watched
                          ? 'card__button card__button--selected'
                          : 'card__button'
                      }" title="JÁ VI" data-button="watched"><i class="card__icon fas fa-eye"></i></button>
                      <button class="${
                        watchlist
                          ? 'card__button card__button--selected'
                          : 'card__button'
                      }" title="QUERO VER" data-button="watchlist"><i class="card__icon fas fa-plus-square"></i></button>
                      <button class="${
                        favorite
                          ? 'card__button card__button--selected'
                          : 'card__button'
                      }" title="FAVORITO" data-button="favorite"><i class="card__icon fas fa-heart"></i></button>
                    </div>
                   `;

  return card;
};

export default createCard;
