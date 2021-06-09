const express = require('express');

const WebChat = express.Router();

WebChat.get('/', (_req, res) => {
  res.status(200).render('webChat/index', { message: 'OI' });
});

module.exports = {
  WebChat,
};
