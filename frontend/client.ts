
import {InMemoryCache, ApolloClient, HttpLink, from} from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import {isBrowser} from './utils/ssrUtils';


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

async function getNewToken(){
  const fetchResult = await fetch(API_URL+'/graphql', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({
      query: `
        mutation RefreshToken{
          refresh{
            accessToken
            refreshToken
          }
        }
      `,
    }),
  });
  const res = await fetchResult.json();
  if(res.errors){
    throw res.errors;
  }

  localStorage.setItem('accessToken', res.accessToken);
  return res.accessToken;
}

async function logout(){
  await fetch(API_URL+'/graphql', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({
      query: `
        mutation Logout{
          logout
        }
      `,
    }),
  });
}

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward, response }) => {
    if (graphQLErrors && isBrowser()) {
      const err = graphQLErrors[0];
      switch (err.extensions?.code) {
        case 'UNAUTHENTICATED':
          const oldHeaders = operation.getContext().headers;
          getNewToken().then(accessToken => {
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: accessToken,
              },
            });
            return forward(operation);
          }).catch(err => {
            logout();
          });
      }
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
    
    // if(response)
    //   response.errors = undefined;
  }
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, tokenLink])
});

export default client;