class Card {
  constructor({ data, handleCardClick, handleLikeClick, handleDeleteIconClick }) {
    this._text = data.name;
    this._link = data.link;
    this._likes = data.likes;
    this._userId = data.currentUserId;
    this._ownerId = data.owner._id;
    this._cardId = data._id;

    this._handleCardClick = handleCardClick;
    this._handleLikeClick = handleLikeClick;
    this._handleDeleteIconClick = handleDeleteIconClick;
  }

  removeCard() {
    this._element.remove();
    // Можно лучше
    // При удалении элемента, лучше будет также приравнивать текущий элемент к nul (this._element = null). Таким образом, автоматически будут удалены все связанные с элементом ссылки и обработчики событий. Используя только метод remove элемент удаляется только из разметки.
  }

  getView() {
    this._element = document
      .querySelector('.card-template')
      .content
      // Отлично, что не пропустив .querySelector('.card') в выражении для const cardElement, вы извлекаете из шаблона сам элемент каточки, а не DocumentFragment. Извлекая элемент, а не фрагмент, вы избежите некоторых трудностей при программировании, например DocumentFragment нельзя удалить с помощью метода remove(), а элемент можно.
      .querySelector('.card')
      .cloneNode(true);

    this._element.querySelector('.card__like-button')
      .addEventListener('click', () => this._handleLikeClick(this));
      //Отлично, что при добавлении слушателей событий на элементы используются стрелочные функции, это предотвращает изменение значения контекста this при добавлении.

    this._element.querySelector('.card__delete-button')
      .addEventListener('click', () => this._handleDeleteIconClick(this));

    this._element.querySelector('.card__image')
      .addEventListener('click', () => this._handleCardClick({
        name: this._text,
        src: this._link
      }));

    this._element.querySelector('.card__delete-button')
      .classList.add(this._userId === this._ownerId ? 'card__delete-button_visible' : 'card__delete-button_hidden');
    this._element.querySelector('.card__image').style.backgroundImage = `url(${this._link})`;
    this._element.querySelector('.card__title').innerHTML = this._text;

    this._element.querySelector('.card__like-count').innerHTML = this._likes.length;

    if (this.isLiked()) this._element.querySelector('.card__like-button')
      .classList.add('card__like-button_is-active');
    else this._element.querySelector('.card__like-button')
      .classList.remove('card__like-button_is-active');

    return this._element;
  }

  isLiked() {
    return Boolean(this._likes.find(item => item._id === this._userId));
  }

  id() {
    return this._cardId;
  }

  setLikesInfo(data) {
    this._likes = data.likes;
  }

  getElement() {
    return this._element;
  }
}

export default Card;
