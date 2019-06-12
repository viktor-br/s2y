const query = require('./query');
const mutation = require('./mutation');
const subscription = require('./subscription');
const message = require('./types/message');

const typeDefs = [
  query,
  mutation,
  subscription,
  message,
];

module.exports = typeDefs;
