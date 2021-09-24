import type { NextPage, GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import MainContainer from '../components/MainContainer/MainContainer';
import SharePost from '../components/SharePost/SharePost';
import HomeRightbar from '../components/HomeRightbar/HomeRightbar';
import Post from '../components/Post/Post';
import {useRefresh} from '../apollo/mutations/refresh';
import validateRefreshToken from '../utils/validateRefreshToken';
import getAllPosts from '../apollo/queries/getAllPosts';
import type {IGetAllPosts} from '../apollo/queries/getAllPosts';
import apolloClient from '../apollo/client';
import { useLazyQuery, useQuery } from '@apollo/client';

import styles from '../public/styles/home.module.scss';


const Home: NextPage = () => {
  const postsLimit = 20;
  const [nextPostsLimit, setNextPostsLimit] = useState(20);
  const {data: posts, loading: postsLoading} = useQuery<IGetAllPosts>(getAllPosts, {
    variables: {
      limit: postsLimit,
      offset: 0
    }
  });
  const [fetchMorePosts, {data: nextPosts, loading: nextPostsLoading}] = useLazyQuery<IGetAllPosts>(getAllPosts);
  
  const {refresh} = useRefresh();

  useEffect(() => {
    refresh();
    const scrollHandler = () => {
      if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 200){
        fetchMorePosts({
          variables: {
            limit: nextPostsLimit,
            offset: postsLimit
          }
        });
        setNextPostsLimit(currentLimit => currentLimit+postsLimit);
      }
    };

    window.addEventListener('scroll', scrollHandler);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);
  
  return (
    <MainContainer activePage={2} title="Home">
      <section className={styles.homepage}>
        <section className={styles.news}>
          <SharePost/>
          <section className={styles.posts}>
            {postsLoading ? 'Загрузка...' 
              : posts?.getTimelinePosts.length ? 
                posts.getTimelinePosts.map(post => {
                  return (
                    <Post key={post.id} post={post}/>
                  )
                }) :
                'Постов нет'
            }
            {nextPostsLoading ? 'Загрузка...' 
              : nextPosts?.getTimelinePosts.length ? 
                nextPosts.getTimelinePosts.map(post => {
                  return (
                    <Post key={post.id} post={post}/>
                  )
                }) :
                null
            }
          </section>
        </section>
        <HomeRightbar/>
      </section>
    </MainContainer>
  );
};
export default Home;

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

  const client = apolloClient();
  await client.query<IGetAllPosts>({
    query: getAllPosts,
    variables: {
      limit: 20,
      offset: 0,
      refreshToken: req.cookies.refreshToken
    }
  });

  return {
    props: {
      apolloState: client.cache.extract()
    }
  };
};