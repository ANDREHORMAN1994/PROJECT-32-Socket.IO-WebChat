const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { webChatServer } = require('./sockets');
const { routeWebChat } = require('./routes');

const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

webChatServer(io);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(routeWebChat.WebChat);

http.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
