import { createLogger, format, transports } from 'winston';
import { ApolloServer } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';
import express from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import cors from 'cors';
import { MessageRepository, AccountRepository } from './data-sources';
import createResolvers from './resolvers';
import typeDefs from './type-defs';
import config from './config';
import Session from './session';
import {
  createSessionStorage,
  createPersistentStoragePool,
  createContext,
  createLoginHandler,
  createSubscriptionOnConnectHandler,
} from './app';

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
const resolvers = createResolvers();

const contextData = {
  logger,
  pubsub,
  messageRepository,
  accountRepository,
  session,
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
