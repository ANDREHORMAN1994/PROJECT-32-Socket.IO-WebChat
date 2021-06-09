const socket = window.io();

const newMessage = (message, className) => {
  const divMessages = document.querySelector('.messages-container');
  const p = document.createElement('p');
  p.classList.add(className);
  p.innerHTML = message;
  p.setAttribute('data-testid', 'message');
  divMessages.appendChild(p);
};

const updateListUsers = (list) => {
  const ul = document.querySelector('ul');
  ul.innerHTML = '';
  list.forEach(({ id, nickname }) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    if (nickname) {
      li.innerHTML = nickname;
    } else {
      li.innerHTML = id;
    }
    ul.appendChild(li);
  });
};

const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getLocalStorage = (key) => {
  const result = JSON.parse(localStorage.getItem(key));
  if (!result) return false;
  return result;
};

socket.on('welcome', ({ listUser, message }) => {
  setLocalStorage('listUser', listUser);
  const list = [];
  for (let i = listUser.length - 1; i >= 0; i -= 1) {
    list.push(listUser[i]);
  }
  updateListUsers(list);
  newMessage(message, 'warning');
});

socket.on('notification', ({ listUser, message }) => {
  updateListUsers(listUser);
  newMessage(message, 'warning');
});

socket.on('logout', ({ listUser, message }) => {
  setLocalStorage('listUser', listUser);
  updateListUsers(listUser);
  newMessage(message, 'warning');
});

// ATUALIZAR NICKNAME

const inputNickName = document.querySelector('#nickname');
const nickNameButton = document.querySelector('#nickname-button');

const updateNickNameUser = (list, userId, newNickName) =>
  list.map(({ id, nickname }) => {
    if (id === userId) {
      return { id, nickname: newNickName };
    }
    return { id, nickname };
  });

nickNameButton.addEventListener('click', () => {
  console.log(inputNickName.value);

  const userId = socket.id.substr(0, 16);
  const list = getLocalStorage('listUser');
  const newList = updateNickNameUser(list, userId, inputNickName.value);
  console.log(newList);

  setLocalStorage('listUser', newList);
  socket.emit('newList', {
    newList,
  });
});

socket.on('newList', (newList) => {
  updateListUsers(newList);
});

// SCRIPT DA MENSAGEM

const inputMessage = document.querySelector('#message');
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const valueInput = inputMessage.value;
  const userObj = getLocalStorage('listUser').find(
    ({ id }) => id === socket.id.substr(0, 16),
  );
  socket.emit('message', {
    chatMessage: valueInput,
    nickname: userObj.nickname || socket.id.substr(0, 16),
  });
});

socket.on('message', (message) => {
  newMessage(message);
});
