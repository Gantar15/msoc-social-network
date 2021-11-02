
import { useMemo } from 'react';
import {ApolloClient, from, NormalizedCacheObject} from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import {isBrowser} from '../utils/ssrUtils';
import refreshTokens from '../utils/refresh';
import logout from '../utils/logout';
import cache from './cache';
import {createUploadLink} from 'apollo-upload-client';
import { split } from '@apollo/client';
import {WebSocketLink} from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import typeDefs from './typeDefs';
const wsImpl = require('ws');


const API_URL = 'http://localhost:7700';
const API_WS_URL = 'ws://localhost:7700';
const CLIENT_URL = 'http://localhost:3000';


let token: string | null = '';
if(isBrowser())
 token = localStorage.getItem('accessToken');

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      console.log(`[GraphQL errors]: ${graphQLErrors.reduce((txt, err) => txt + err.path+' '+err.message, '')}`);
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError.message}`);
    }

    return forward(operation);
  }
);


const uploadLink = createUploadLink({
  uri: API_URL + '/graphql',
  headers: {
    authorization: `Bearer ${token}`
  },
  credentials: 'include',
  fetch: async (uri, options) => {
    const resp = await fetch(uri, options);
    const cloneResp = resp.clone();
    const data = await cloneResp.json();

    if(data.errors && data.errors[0].extensions.code === "UNAUTHENTICATED"){
      try{
        const result = await refreshTokens(API_URL+'/graphql');
          if('errors' in result) throw result.errors[0].message;

          const accessToken = result.data.refresh.accessToken;
          localStorage.setItem('accessToken', accessToken);
          //@ts-ignore
          options.headers.authorization = `Bearer ${accessToken}`;

          return fetch(uri, options);
      } catch(err){
        logout(API_URL+'/graphql');
        if(isBrowser())
          location.href = '/login';
      };
    }

    return Promise.resolve(resp);
  }
});


const wsLink = new WebSocketLink({
  uri: API_WS_URL + '/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      authorization: `Bearer ${token}`
    },
  },
  webSocketImpl: isBrowser() ? WebSocket : wsImpl 
});


const resultLink = split(
  ({query}) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind == 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  uploadLink
);


let apolloClient: ApolloClient<NormalizedCacheObject>;
export default function initClient(apolloState?: NormalizedCacheObject){
  apolloClient = apolloClient ?? new ApolloClient({
    ssrMode: !isBrowser(),
    cache: cache,
    link: from([errorLink, resultLink]),
    typeDefs
  });

  if(apolloState){
    const existingCache = apolloClient.cache.extract();
    apolloClient.restore({...existingCache, ...apolloState});
  }

  return apolloClient;
}


export const useApollo = (apolloState?: NormalizedCacheObject) => {
  return useMemo(() => initClient(apolloState), [apolloState]);
};