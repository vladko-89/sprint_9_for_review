class Popup {
  constructor(popupSelector) {
    this._popupElement = document.querySelector(`.${popupSelector}`);
  }

  setEventListeners() {
    this._popupElement.addEventListener('click', (evt) => {
      if (evt.target.classList.contains('popup') || evt.target.classList.contains('popup__close')) {
        this.close();
      }
    });
  }

  open() {
    this._popupElement.classList.add('popup_is-opened');
    document.addEventListener('keyup', (evt) => {
      evt.preventDefault();
      // Нужно исправить
      // На текущий момент метод .witch исключен из спецификации и не является надежным решением. Возможные варианты решения можно подобрать из статьи: https://learn.javascript.ru/keyboard-events. Подробнее про .witch  можно прочесть здесь: https://developer.mozilla.org/ru/docs/Web/API/UIEvent/which
      if (evt.which === 27) this.close()
    });
  }

  // Нужно исправить
  // При закрытии модального окна, необходимо удалять слушатель события закрытия по нажатию Esc. Сейчас, при каждом закрытии попапов созданные обработчики остаются, тем самым забивется память.
  close() {
    this._popupElement.classList.remove('popup_is-opened');
  }
}

export default Popup;
