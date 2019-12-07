const { createLogger, format, transports } = require('winston');
const { ApolloServer } = require('apollo-server-express');
const { RedisPubSub } = require('graphql-redis-subscriptions');
const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const { GoogleSignInClient } = require('./authentication');
const { MessageRepository, AccountRepository } = require('./data-sources');
const resolvers = require('./resolvers');
const typeDefs = require('./type-defs');
const config = require('./config');
const Session = require('./session');
const {
  createSessionStorage,
  createPersistentStoragePool,
  createContext,
  createAuthHandler,
  createLogoutHandler,
  createSubscriptionOnConnectHandler,
  createErrorFormatter,
} = require('./app');

const getCurrentDate = () => new Date(Date.now());
const pubsub = new RedisPubSub({
  connection: {
    host: config.get('subscription.pubsub.host'),
    port: config.get('subscription.pubsub.port'),
    retryStrategy: (times) => Math.min(times * 50, 2000),
  },
});

const logger = createLogger({
  format: format.combine(
    format.splat(),
    format.colorize(),
    format.align(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(
      (info) =>
        `${info.timestamp} ${info.level}: ${
          info instanceof Error ? JSON.stringify(info.stack) : info.message
        }`,
    ),
  ),
  transports: [new transports.Console()],
});

const session = new Session(createSessionStorage(logger, config));
const pool = createPersistentStoragePool(config);
const messageRepository = new MessageRepository(pool);
const accountRepository = new AccountRepository(pool);
const googleSignInClientId = config.get('google.sign_in.client_id');
const oAuth2Client = new OAuth2Client(googleSignInClientId);
const googleSignInClient = new GoogleSignInClient(
  oAuth2Client,
  googleSignInClientId,
);

const contextData = {
  logger,
  pubsub,
  messageRepository,
  accountRepository,
  session,
  getCurrentDate,
  googleSignInClient,
};

const context = createContext(contextData);

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  formatError: createErrorFormatter(logger),
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

app.post('/auth', createAuthHandler(contextData));
app.post('/logout', createLogoutHandler(contextData));

httpServer.listen({ port: 4000 }, () => logger.info('🚀 Server ready'));
