// const { ObjectID } = require('mongodb');
// const connection = require('./connection');

// const NAME_COLLECTION = 'messages';

// const create = async (name, email, password, role) => {
//   const newUser = await connection().then((db) => db.collection(NAME_COLLECTION)
//     .insertOne({ name, email, password, role }));
//   return newUser;
// };