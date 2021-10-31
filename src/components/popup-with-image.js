import Popup from './popup.js';
import {popupImageElement, popupImageElementCaption} from '../utils/constants.js';

class PopupWithImage extends Popup {
  // Нужно исправить
  // Родительский класс Popup имеет свой метож open. В дочерних классах будет лучше переопределять этот метод через вызов super().
  open({ link, name }) {
    // Нужно исправить
    // атрибут alt при открытии модального окна с изображением карточки остается пустым.
    popupImageElementCaption.textContent = name;
    popupImageElement.src = link;
    this._popupElement.classList.add('popup_is-opened');
    document.addEventListener('keyup', (evt) => {
      evt.preventDefault();
      if (evt.which === 27)
        this.close()
    });
  }
}

export default PopupWithImage;
