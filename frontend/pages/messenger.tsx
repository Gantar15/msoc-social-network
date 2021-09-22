import type { NextPage, GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import MainContainer from '../components/MainContainer/MainContainer';
import {useRefresh} from '../apollo/mutations/refresh';
import validateRefreshToken from '../utils/validateRefreshToken';
import apolloClient from '../apollo/client';
import { useQuery } from '@apollo/client';

import styles from '../public/styles/messenger.module.scss';


const Messenger: NextPage = () => {
  const {refresh} = useRefresh();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <MainContainer activePage={3} title="Home">
      <main className={styles.messenger}>сообщения</main>
    </MainContainer>
  );
};
export default Messenger;

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const API_URL = 'http://localhost:7700';
  const result = await validateRefreshToken(API_URL+'/auth/refreshTokenValidate', req.cookies.refreshToken);
  if(!result){
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  return {
    props: {
        
    }
  };
};