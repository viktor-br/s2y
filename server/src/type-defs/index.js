const query = require('./query');
const mutation = require('./mutation');
const subscription = require('./subscription');
const message = require('./types/message');
const myProfile = require('./types/my-profile');

const typeDefs = [query, mutation, subscription, message, myProfile];

module.exports = typeDefs;
