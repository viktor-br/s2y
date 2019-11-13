import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

function CreateApiClient() {
  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_SEND2YOURSELF_WS_URI,
    options: {
      reconnect: true,
    },
  });

  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_SEND2YOURSELF_URI,
  });

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  );

  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      dataIdFromObject: (object) => object.uuid || null,
    }),
  });
}

export default CreateApiClient;
