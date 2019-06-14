const { createLogger, format, transports } = require('winston');
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const cors = require('cors');
const { MessageRepository, AccountRepository } = require('./data-sources');
const resolvers = require('./resolvers');
const typeDefs = require('./type-defs');
const config = require('./config');
const Session = require('./session');
const {
  createSessionStorage,
  createPersistentStoragePool,
  createContext,
  createLoginHandler,
  createSubscriptionOnConnectHandler,
} = require('./app');
const getCurrentDate = () => new Date(Date.now());
const pubsub = new PubSub();

const logger = createLogger({
  format: format.combine(
    format.splat(),
    format.colorize(),
    format.align(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(
      info => `${info.timestamp} ${info.level}: ${info instanceof Error ? JSON.stringify(info.stack) : info.message}`,
    ),
  ),
  transports: [
    new transports.Console(),
  ],
});

const session = new Session(createSessionStorage(logger, config));
const pool = createPersistentStoragePool(config);
const messageRepository = new MessageRepository(pool);
const accountRepository = new AccountRepository(pool);

const contextData = {
  logger,
  pubsub,
  messageRepository,
  accountRepository,
  session,
  getCurrentDate,
};

const context = createContext(contextData);

const app = express();
app.use(cookieParser());
app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  subscriptions: {
    path: '/ws/',
    onConnect: createSubscriptionOnConnectHandler(contextData),
  },
  introspection: true,
  playground: {
    endpoint: '/graphql/',
  },
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

app.get('/login', createLoginHandler(session, accountRepository));

httpServer.listen({ port: 4000 }, () => (
  logger.info('🚀 Server ready')
));
