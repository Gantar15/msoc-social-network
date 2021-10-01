import type { NextPage, GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import MainContainer from '../../components/MainContainer/MainContainer';
import {useRefresh} from '../../apollo/mutations/refresh';
import validateRefreshToken from '../../utils/validateRefreshToken';
import MessengerNavigator from '../../components/Messenges/MessengerNavigator/MessengerNavigator';
import RoomPage from '../../components/Messenges/RoomPage/RoomPage';
import { useRouter } from 'next/router';

import styles from '/public/styles/messenger.module.scss';


const Messenger: NextPage = () => {
    const router = useRouter();
  const [interlocutorRoom, setInterlocutorRoom] = useState<number | undefined>(+router.query!.roomId!);
  const {refresh} = useRefresh();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <MainContainer activePage={3} title="Messenger">
      <main className={styles.messenger}>
        <MessengerNavigator setInterlocutorRoom={setInterlocutorRoom}/>
        <RoomPage interlocutorRoom={interlocutorRoom}/>
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