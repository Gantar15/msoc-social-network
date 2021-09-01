
import {ApolloClient, HttpLink, from} from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import {isBrowser} from '../utils/ssrUtils';
import refreshTokens from '../utils/refresh';
import logout from '../utils/logout';
import cache from './cache';
import {createUploadLink} from 'apollo-upload-client';


const API_URL = 'http://localhost:7700';


let token: string | null = '';
if(isBrowser())
 token = localStorage.getItem('accessToken');

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      console.log(`[GraphQL errors]: ${graphQLErrors.reduce((txt, err) => txt + err.path+' '+err.message, '')}`);
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
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
      console.log(data.errors[0].extensions.code)
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
        location.href = '/login';
      };
    }

    return Promise.resolve(resp);
  }
});

const client = new ApolloClient({
  cache: cache,
  link: from([errorLink, uploadLink])
});

export default client;