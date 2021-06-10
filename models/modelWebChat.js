// const { ObjectID } = require('mongodb');
const connection = require('./connection');

const NAME_COLLECTION = 'messages';

const validateInfoBody = (message, nickname, timestamp) => {
  if (!message) throw new Error('message not exist');
  if (!nickname) throw new Error('nickname not exist');
  if (!timestamp) throw new Error('timestamp not exist');
};

const create = async (message, nickname, timestamp) => {
  validateInfoBody(message, nickname, timestamp);
  const newUser = await connection().then((db) =>
    db.collection(NAME_COLLECTION).insertOne({ message, nickname, timestamp }));
  if (!newUser) throw new Error('newUser not exist');
  return newUser;
};

const findAll = async () => {
  const users = await connection().then((db) =>
    db.collection(NAME_COLLECTION).find().toArray());
  return users;
};

module.exports = {
  create,
  findAll,
};
