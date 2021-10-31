import Popup from './popup.js';
import FormValidator from './form-validator.js';
import { defaultFormConfig} from '../utils/constants.js';

class PopupWithForm extends Popup {
  constructor({ popupSelector, handleFormSubmit, popupConfig }) {
    super(popupSelector);

    this._popupConfig = popupConfig;
    // Необходимо исправить
    // Нарушается принцип слабой связанности - класс PopupWithForm, становится зависимым от класса FormValidator. Будет лучше создавать экземпляры FormValidator в insex.js отдельно для каждой формы попапа. Подробнее о типах связи между классами можно прочитать здесь https://practicum.yandex.ru/learn/web/courses/370a2c73-45bf-439f-a747-ef4e3c0db48f/sprints/1703/topics/f27d0d85-d368-467e-a8a4-068277e68667/lessons/984b6648-17e2-471f-94a7-063d1884e15e/
    this._validator = new FormValidator(defaultFormConfig, popupConfig);

    this._popupForm = this._popupElement.querySelector('.popup__form');
    this._handleFormSubmit = handleFormSubmit;
  }

  _getInputValues() {
    this._inputList = this._popupElement.querySelectorAll('.popup_input');

    if (this._popupConfig === 'popup_type_edit') {
      return {
        userName: this._inputList[0].value,
        userDescription: this._inputList[1].value
      }
    }

    if (this._popupConfig === 'popup_type_new-card') {
      return {
        name: this._inputList[0].value,
        link: this._inputList[1].value
      }
    }

    if (this._popupConfig === 'popup__edit-avatar') {
      return {
        avatar: this._inputList[0].value
      }
    }
  }

  open() {
    // Нужно исправить
    // Ключевое слово super  необходимо вызывать до момента обращения к ключевому слову this. Подробнее можно ознакомиться здесь: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/super
    this._validator.enableValidation();
    super.open();
  }

  setEventListeners() {
    this._popupElement.addEventListener('submit', () => {
      this._handleFormSubmit(this._getInputValues());
      // Нужно исправить
      // Закрытие модальных окон должно происходить в цепочке промиса, после получения ответа от сервера. В данный момент, модальные окна закрываются сразу же, не дожидаясь ответа от сервера.
      this.close();
    });
    // Нужно исправить
    // Ключевое слово super  необходимо вызывать до момента обращения к ключевому слову this. Подробнее можно ознакомиться здесь: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/super
    super.setEventListeners();
  }
}

export default PopupWithForm;
