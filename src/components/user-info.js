class UserInfo {
  getUserInfo() {
    return {
      userName: document.querySelector(`.profile__title`).textContent,
      userDescription: document.querySelector(`.profile__description`).textContent,
      userAvatar: document.querySelector(`.profile__image`).style.backgroundImage.slice(5, -2)
    }
  }

  setUserInfo({ userName, userDescription, userAvatar }) {
    // Нужно исправить
    // Метод innerHTML для работы с контентом не безопасно. Лучше заменить его на textContent. Подробнее об этом можно почитать в уроке https://practicum.yandex.ru/learn/web/courses/35d951a1-b62c-4a96-96ac-a8118657fad0/sprints/1702/topics/d3024334-01aa-4c62-92ca-0aba951c7f5b/lessons/16436625-8e57-4a67-8f2d-5ecf8255b504/
    if (userName) document.querySelector(`.profile__title`).innerHTML = userName;
    if (userDescription) document.querySelector(`.profile__description`).innerHTML = userDescription;
    if (userAvatar) document.querySelector(`.profile__image`).style.backgroundImage = `url(${userAvatar})`;
  }
}

export default UserInfo;
