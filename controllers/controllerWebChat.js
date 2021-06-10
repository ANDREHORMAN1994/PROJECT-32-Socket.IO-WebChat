// const model = require('../models/modelWebChat');

const getPageRender = (_req, res, next) => {
  try {
    res.status(200).render('webChat/index', { message: 'SOCKET.IO - WEBCHAT' });
  } catch (error) {
    console.log(error);
    next({
      status: 404,
      message: error.message,
    });
  }
};

module.exports = {
  getPageRender,
};
