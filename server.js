const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { webChatServer } = require('./sockets');
const { routeWebChat } = require('./routes');

webChatServer(io);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(`${__dirname}/public`));

app.use(routeWebChat.WebChat);
app.use((err, _req, res, _next) => {
  const { status, message } = err;
  res.status(status).json({
    message,
  });
});

http.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
