import type { AppProps } from 'next/app';
import {ApolloProvider, InMemoryCache, ApolloClient, HttpLink} from '@apollo/client';

import '../styles/globals.scss';


const API_URL = 'http://localhost:7700';

const tokenLink = new HttpLink({
  uri: API_URL + '/graphql',
  headers: {
    Authentication: `Bearer ${localStorage.getItem('accessToken')}`
  }
});
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: tokenLink
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
