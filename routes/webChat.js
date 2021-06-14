const express = require('express');

const { controllerWebChat } = require('../controllers');

const WebChat = express.Router();

WebChat.get('/', controllerWebChat.getPageRender);

WebChat.get('/test', (_req, res) => {
  res.status(200).json({
    message: 'PROJETO WEBCHAT',
  });
});

module.exports = {
  WebChat,
};
