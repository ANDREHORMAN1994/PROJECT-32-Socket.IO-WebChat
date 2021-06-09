let listUser = [];

const webChatServer = io => {
  io.on('connection', socket => {
    const id = socket.id.substr(0, 16);
    listUser.push({ id, nickname: null });
    console.log(listUser);
    console.log(`cliente conectado com id: ${id}`);

    socket.on('disconnect', () => {
      listUser = listUser.filter(user => user.id !== id);
      const message = `cliente: ${id} foi desconectado`;
      console.log(listUser);
      console.log(message);
      socket.broadcast.emit('logout', {
        listUser,
        message,
      });
    });

    socket.emit('welcome', {
      listUser,
      message: `Seja Bem Vindo!! Cliente ${id}`,
    });

    socket.broadcast.emit('notification', {
      listUser,
      message: `Client ${id} acabou de se conectar`,
    });

    socket.on('newList', ({ newList }) => {
      listUser = newList;
      console.log(listUser);
      io.emit('newList', newList);
    });

    socket.on('message', ({ chatMessage, nickname, date }) => {
      const message = `${date} - ${nickname}: ${chatMessage}`;
      io.emit('message', message);
    });
  });
};

module.exports = webChatServer;
