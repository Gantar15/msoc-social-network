import type { NextPage, GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import MainContainer from '../components/MainContainer/MainContainer';
import {useRefresh} from '../apollo/mutations/refresh';
import validateRefreshToken from '../utils/validateRefreshToken';
import watchMessenge, {watchMessenge_Subscription} from '../apollo/subsciptions/watchMessenge';
import { useSubscription } from '@apollo/client';
import MessengerNavigator from '../components/Messenges/MessengerNavigator/MessengerNavigator';
import RoomPage from '../components/Messenges/RoomPage/RoomPage';

import styles from '../public/styles/messenger.module.scss';


const Messenger: NextPage = () => {
  const {refresh} = useRefresh();
  const {data: messenge, loading: messengeLoading} = useSubscription<watchMessenge_Subscription>(watchMessenge, {variables: {
    recipientId: 1
  }});
  
  useEffect(() => {
    console.log(messenge)
  }, [messenge]);

  useEffect(() => {
    refresh();
  }, []);

  return (
    <MainContainer activePage={3} title="Home">
      <main className={styles.messenger}>
        <MessengerNavigator/>
        <RoomPage/>
      </main>
    </MainContainer>
  );
};
export default Messenger;

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const result = await validateRefreshToken(process.env.API_URL+'/auth/refreshTokenValidate', req.cookies.refreshToken);
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