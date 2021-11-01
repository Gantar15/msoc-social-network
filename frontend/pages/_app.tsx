import type { AppProps } from 'next/app';
import {ApolloProvider} from '@apollo/client';
import {useApollo} from '../apollo/client';

import '../public/styles/globals.scss';


function MyApp({ Component, pageProps }: AppProps) {
  const client = useApollo(pageProps.apolloState);
  
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
