
import {ApolloClient, HttpLink, from} from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import {isBrowser} from '../utils/ssrUtils';
import refreahToken from '../utils/refresh';
import logout from '../utils/logout';
import cache from './cache';


const API_URL = 'http://localhost:7700';


let token: string | null = '';
if(isBrowser())
 token = localStorage.getItem('accessToken');

const tokenLink = new HttpLink({
  uri: API_URL + '/graphql',
  headers: {
    authorization: `Bearer ${token}`
  },
  credentials: 'include'
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      const err = graphQLErrors[0];
      switch (err.extensions?.code) {
        case 'UNAUTHENTICATED':
          const oldHeaders = operation.getContext().headers;
          console.log(oldHeaders)
          refreahToken(API_URL+'/graphql', oldHeaders).then(result => {
            if('errors' in result) throw '';
            const accessToken = result.data.refresh.accessToken;
            localStorage.setItem('accessToken', accessToken);
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${accessToken}`,
              },
            });
            return forward(operation);
          }).catch(err => {
            logout(API_URL+'/graphql', oldHeaders);
          });
          break;
      }
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  }
);

const client = new ApolloClient({
  cache: cache,
  link: from([errorLink, tokenLink])
});

export default client;