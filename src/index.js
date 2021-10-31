// Нужно исправить
// Файл index.js необходимо перенести в директорию pages

import './index.css';
import './images/avatar.jpg';

import Card from './components/card.js';
import Section from './components/section.js';
import PopupWithImage from './components/popup-with-image.js';
import PopupWithForm from './components/popup-with-form.js';
import PopupWithFormSubmit from './components/popup-with-form-submit.js';
import UserInfo from './components/user-info.js';
import Api from './components/api.js'
import { popupConfig, cardsConfig } from './utils/constants.js';
import { renderLoading } from "./utils/utils.js";

const openEditFormButton = document.querySelector('.profile__edit-button');
const openCardFormButton = document.querySelector('.profile__add-button');
const openAvatarFormButton = document.querySelector('.profile__image');
const titleInputValue = document.querySelector('.popup_input_type_name');
const descriptionInputValue = document.querySelector('.popup_input_type_description');

const editFormSaveButton = document.querySelector(".popup_type_edit button[type='submit']");
const cardFormSaveButton = document.querySelector(".popup_type_new-card button[type='submit']");

// Нужно исправить
// Переменная api создается только один раз и не далее не переопределяется, поэтому необходимо определить ее через const
let api = new Api({
  address: 'https://mesto.nomoreparties.co/v1',
  groupId: `cohort-23`,
  token: `eee2ea0d-1fd3-481c-aa66-4794a11da97e`,
});

let userId = null;

// Нужно исправить
// Переменная cardInfoSubmit создается только один раз и не далее не переопределяется, поэтому необходимо определить ее через const
let cardInfoSubmit = new PopupWithFormSubmit(popupConfig.removeCardModalWindow);
cardInfoSubmit.setEventListeners();

const cardList = new Section({
    renderer: (cardData) => {

      // Нужно исправить
        // Алгоритм создания карточки лучше вынести в отдельную функцию, и вызывать как при создании новой карточки через форму, так и при начальной отрисовке карточек
      const card = new Card({
        data: { ...cardData, currentUserId: userId },
        handleCardClick: () => {
          // Нужно исправить
          // Каждый раз при срабатывании колбека открытия попапа карточки, будет создаваться новый экземпляр класса PopupWithImage. Многократное открытие попапов приведет к засорению памяти и некорректной работе приложения. Создание экземпляра лучше вынести в глобальную область видимости и при необходимости обращаться к нему

          // Переменная imagePopup создается только один раз и не далее не переопределяется, поэтому необходимо определить ее через const
          let imagePopup = new PopupWithImage(popupConfig.imageModalWindow);
          imagePopup.setEventListeners();
          imagePopup.open(cardData);
        },
        handleLikeClick: (card) => {
          api.changeLikeCardStatus(card.id(), !card.isLiked())
            .then(data => {
              card.setLikesInfo({ ...data });
              card.getElement().querySelector('.card__like-count').textContent = data.likes.length;

              if (card.isLiked()) card.getElement().querySelector('.card__like-button')
                .classList.add('card__like-button_is-active');
              else card.getElement().querySelector('.card__like-button')
                .classList.remove('card__like-button_is-active');
            })
            .catch(err => console.log(`Ошибка изменения статуса лайка: ${err}`))
        },
        handleDeleteIconClick: (card) => {
          cardInfoSubmit.open();
          cardInfoSubmit.setSubmitAction(() => {
            api.removeCard(card.id());
            // Нужно исправить
            // Метод удаления карточки отвязан от запроса на удаление к серверу. Даже если запрос завершиться с ошибкой, карточка пропадет из интерфейса. Чтобы этого избежать, необходимо использовать .then()
            card.getElement().remove();
            cardInfoSubmit.close();
          });
        },
      });

      cardList.addItem(card.getView());
    }
  }
);

const newCardPopup = new PopupWithForm({
  popupSelector: popupConfig.cardFormModalWindow,
  handleFormSubmit: (data) => {
    renderLoading(cardFormSaveButton, true);
    api.addCard(data)
      .then((cardData) => {
        // Нужно исправить
        // Алгоритм создания карточки лучше вынести в отдельную функцию, и вызывать как при создании новой карточки через форму, так и при начальной отрисовке карточек
        const card = new Card({
          data: { ...cardData, currentUserId: userId },
          handleCardClick: () => {
            let imagePopup = new PopupWithImage(popupConfig.imageModalWindow);
            imagePopup.setEventListeners();
            imagePopup.open(cardData);
          },
          handleLikeClick: (card) => {
            api.changeLikeCardStatus(card.id(), !card.isLiked())
              .then(data => {
                card.setLikesInfo({ ...data });
                card.getElement().querySelector('.card__like-count').textContent = data.likes.length;

                if (card.isLiked()) card.getElement().querySelector('.card__like-button')
                  .classList.add('card__like-button_is-active');
                else card.getElement().querySelector('.card__like-button')
                  .classList.remove('card__like-button_is-active');
              })
              .catch(err => console.log(`Ошибка изменения статуса лайка: ${err}`))
          },
          handleDeleteIconClick: (card) => {
            cardInfoSubmit.open();
            cardInfoSubmit.setSubmitAction(() => {
              api.removeCard(card.id());
              // Нужно исправить
            // Метод удаления карточки отвязан от запроса на удаление к серверу. Даже если запрос завершиться с ошибкой, карточка пропадет из интерфейса. Чтобы этого избежать, необходимо использовать .then().

            // Также, необходимо обработать возможные ошибки в блоке .catch
              card.getElement().remove();
              cardInfoSubmit.close();
            });
          },
        });

        document.querySelector(`.${cardsConfig.placesWrap}`).append(card.getView());
      })
      .catch(err => console.log(`Ошибка добавления карточки: ${err}`))
      .finally(() => {
        renderLoading(cardFormSaveButton);
      });
  },
  popupConfig: popupConfig.cardFormModalWindow
});
newCardPopup.setEventListeners();

const userInfoPopup = new PopupWithForm({
  popupSelector: popupConfig.editFormModalWindow,
  handleFormSubmit: (data) => {
    renderLoading(editFormSaveButton, true);
    api.setUserInfo({
      name: data.userName,
      about: data.userDescription
    })
      .then((info) => {
        // Нужно исправить
        // Каждый раз при положительном результате запроса, создается новый экземпляр класса UserInfo. Необходимо вынести создание класса в глобальную область и при необходимости менять его.
        const userInfo = new UserInfo();
        userInfo.setUserInfo({
          userName: info.name,
          userDescription: info.about,
        })
      })
      .catch(err => console.log(`Ошибка при обновлении информации о пользователе: ${err}`))
      .finally(() => {
        renderLoading(editFormSaveButton);
      });
  },
  popupConfig: popupConfig.editFormModalWindow
});
userInfoPopup.setEventListeners();

const changeAvatarPopup = new PopupWithForm({
  popupSelector: popupConfig.changeAvatarModalWindow,
  handleFormSubmit: (data) => {
    // Нужно исправить
    // После выполнения запроса к серверу ответ необходимо обрабатывать в блоках .then, .catch
    api.setUserAvatar({
      avatar: data.avatar
    });
    // Нужно исправить
    // Каждый раз при положительном результате запроса, создается новый экземпляр класса UserInfo. Необходимо вынести создание класса в глобальную область и при необходимости обращаться к нему.
    const userInfo = new UserInfo();
    userInfo.setUserInfo({
      userAvatar: data.avatar,
    });
  },
  popupConfig: popupConfig.changeAvatarModalWindow
});
changeAvatarPopup.setEventListeners();

openEditFormButton.addEventListener('click', () => {
  // Нужно исправить
  // При каждома срабатывании события click  на кнопку открытия формы измпенения данных пользователя, создается новый экземпляр класса UserInfo. Необходимо вынести создание экземпляра класса в глобальную область видимости и при необходимости образщаться к этому экземпляру
  const userInfo = new UserInfo();
  const currentUserInfo = userInfo.getUserInfo();
  titleInputValue.value = currentUserInfo.userName;
  descriptionInputValue.value = currentUserInfo.userDescription;
  userInfoPopup.open();
});

openCardFormButton.addEventListener('click', () => {
  newCardPopup.open();
});

openAvatarFormButton.addEventListener('click', () => {
  changeAvatarPopup.open();
});


// Можно лучше
// Для первичного получения данных, будет лучше воспользоваться методом Promise.all. Данный метод избавит от необходимости делать вложенные запросы и сделает код более читабельным. Подробнее о применеии Promise.all можно прочсеть здесь: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
api.getCardList().then((cardsArray) => {
  api.getUserInfo().then((userData) => {
    userId = userData._id;
    // Нужно исправить
    // Создание экземпляра класса UserInfo лучше вынести в глобальную область, а затем обращаться к нему при необходимости.
    const userInfo = new UserInfo();
    userInfo.setUserInfo({
      userName: userData.name,
      userDescription: userData.about,
      userAvatar: userData.avatar
    });

    cardList.renderItems(cardsArray);
  })
})
  .catch(err => console.log(`Ошибка загрузки данных: ${err}`))



  // Проделана большая работа.
  // Хотелось бы отметить сильные стороны работы:
  // 1. Классы элементов именуются в соответствии с системой БЭМ
  // 2. Здорово что используется spread операторы при передаче конфига форм.
  // 3. Заявленный в брифе функционал работает в полном объеме
  // 4. Для кнопок отправки форм (в модальных окнах добавления новой карточки и  изменения данных пользователя) создан свой класс
  // 5. Все лишние переменные и вспомогательные функции вынесены из index.js в отдельный файл.

  // Некоторые вещи можно сделать лучше:
  // 1. Для первичного получения данных пользователя и карточек, будет лучше использовать Promise.all вместо вложенных запросов.

  // Но есть моменты на которые стоит обратить внимание и исправить:
  // 1. При открытии модального окна Изменение аватара пользователя, кнопка отправки формы активна. Есть возмоность отправки пустой формы.
  // 2. После добавления новой карточки и повторного открытия модального окна Добавить карточку, форма не очищается и содержит ранее вводимые данные
  // 3. Если закрыть модальное окно с выведенным текстом ошибки и повторно его открыть - текст ошибки остается быть видимым.
  // 4. При добавлении новой карточки, карточка становится в конец списка карточек. Необходимо, чтобы новая карточка создавалась в начале списка.
  // 5. Директории dist и node_modules необходимо включить в файл .gitignore
  // 6. Все замечания с пометкой Нужно исправить


  // Работа будет принята только при исправлении всех замечаний с пометкой Нужно исправить.

  // Удачи!
