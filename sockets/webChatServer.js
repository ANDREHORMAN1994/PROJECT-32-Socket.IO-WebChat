const model = require('../models/modelWebChat');

let listUser = [];

const checkZero = (data) => {
  let newData = data;
  if (data.length === 1) {
    newData = `0${data}`;
  }
  return newData;
};

const dateNow = () => {
  const today = new Date();
  let day = `${today.getDate()}`;
  let month = `${today.getMonth() + 1}`;
  let year = `${today.getFullYear()}`;
  let hour = `${today.getHours()}`;
  let minutes = `${today.getMinutes()}`;
  let seconds = `${today.getSeconds()}`;

  day = checkZero(day);
  month = checkZero(month);
  year = checkZero(year);
  hour = checkZero(hour);
  minutes = checkZero(minutes);
  seconds = checkZero(seconds);

  if (hour >= 12) return `${day}-${month}-${year} ${hour}:${minutes}:${seconds} PM`;
  return `${day}-${month}-${year} ${hour}:${minutes}:${seconds} AM`;
};

const socketOnDisconnect = (socket) => {
  socket.on('disconnect', () => {
    const id = socket.id.substr(0, 16);
    listUser = listUser.filter((user) => user.id !== id);
    const message = `cliente: ${id} foi desconectado`;
    console.log(message);
    socket.broadcast.emit('logout', { listUser, message });
  });
};

const socketOnWelcome = async (socket) => {
  // const id = socket.id.substr(0, 16);
  const allMessages = await model.findAll();
  const listMessages = allMessages.map((obj) => obj.message);
  // console.log(listMessages);
  socket.emit('welcome', {
    listUser,
    // message: `Seja Bem Vindo!! Cliente ${id}`,
    listMessages,
  });
};

const socketOnNewList = (io, socket) => {
  socket.on('newList', ({ newList }) => {
    listUser = newList;
    io.emit('newList', newList);
  });
};

const socketOnMessage = (io, socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = dateNow();
    const message = `${date} - ${nickname}: ${chatMessage}`;
    await model.create(message, nickname, date);
    io.emit('message', message);
  });
};

const socketOnNotification = (socket) => {
  const id = socket.id.substr(0, 16);
  socket.broadcast.emit('notification', {
    listUser,
    message: `Client ${id} acabou de se conectar`,
  });
};

const webChatServer = (io) => {
  io.on('connection', (socket) => {
    const id = socket.id.substr(0, 16);
    listUser.push({ id, nickname: null });
    console.log(`cliente conectado com id: ${id}`);

    socketOnDisconnect(socket);

    socketOnNewList(io, socket);

    socketOnMessage(io, socket);

    socketOnWelcome(socket);

    socketOnNotification(socket);
  });
};

module.exports = webChatServer;
