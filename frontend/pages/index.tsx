import { gql, useMutation, useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import Image from 'next/image';
import { isBrowser } from '../utils/ssrUtils';


const loginQuery = gql`
mutation login($email: String!, $password: String!){
    login(email: $email, password: $password){
      accessToken
    }
  }
`;
const logoutQuery = gql`
mutation logout{
    logout
  }
`;

const Home: NextPage = () => {
  const [login, {loading, data: loginData}] = useMutation(loginQuery, {
    variables: {
      password: 'asdhgj231',
      email: 'tvararrar@mail.ru'
    }
  });
  const [logout, {error: logoutError, data: logoutData}] = useMutation(logoutQuery, {fetchPolicy: 'network-only'});

  const loginFn = async () => {
    try{
      await login();
    } catch(err){
      console.log(err);
    }
    console.log('login', loginData);
    localStorage.setItem('accessToken', loginData.login.accessToken);
  };
  const logoutFn = async () => {
    try{
      await logout();
    } catch(err){}
    console.log('logout', logoutData)
    localStorage.removeItem('accessToken');
  };

  if(logoutError) return logoutError.message;
  if(loading) return <div>Loading...</div>;
  
  return (
    <>
        <div style={{font: '900 25px Roboto'}} onClick={loginFn}>login</div>
        <div onClick={logoutFn}>logout</div>
    </>
  );
}

export default Home;
