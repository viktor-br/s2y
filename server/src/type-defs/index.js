const query = require('./query');
const mutation = require('./mutation');
const subscription = require('./subscription');
const message = require('./types/message');
const myProfile = require('./types/my-profile');
const dateTime = require('./types/date-time');

const typeDefs = [query, mutation, subscription, message, myProfile, dateTime];

module.exports = typeDefs;
