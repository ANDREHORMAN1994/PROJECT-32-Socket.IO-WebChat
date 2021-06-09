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

const socketOnWelcome = (socket) => {
  const id = socket.id.substr(0, 16);
  socket.emit('welcome', {
    listUser,
    message: `Seja Bem Vindo!! Cliente ${id}`,
  });
};

const socketOnNewList = (io, socket) => {
  socket.on('newList', ({ newList }) => {
    listUser = newList;
    io.emit('newList', newList);
  });
};

const socketOnMessage = (io, socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const message = `${dateNow()} - ${nickname}: ${chatMessage}`;
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
