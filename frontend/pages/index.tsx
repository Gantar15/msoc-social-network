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
import { useQuery } from '@apollo/client';

import styles from '../public/styles/home.module.scss';


const Home: NextPage = () => {
  const postsLimit = 20;
  const [postsOffset, setPostsOffset] = useState(0);
  const {data: posts, loading: postsLoading, fetchMore: fetchMorePosts} = useQuery<IGetAllPosts>(getAllPosts, {
    variables: {
      limit: postsLimit,
      offset: 0
    }
  });
  
  const {refresh} = useRefresh();

  useEffect(() => {
    refresh();
    const scrollHandler = () => {
      if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 200){
        fetchMorePosts({
          variables: {
            limit: postsLimit,
            offset: postsOffset
          }
        });
      }
    };

    window.addEventListener('scroll', scrollHandler);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  useEffect(() => {
    if(posts?.getTimelinePosts)
      setPostsOffset(currentOffset => currentOffset + posts.getTimelinePosts.length);
  }, [posts]);
  
  return (
    <MainContainer activePage={2} title="Home">
      <main className={styles.homepage}>
        <section className={styles.news}>
          <SharePost limit={postsLimit}/>
          <section className={styles.posts}>
            {postsLoading ? 'Загрузка...' 
              : posts?.getTimelinePosts.length ? 
                posts.getTimelinePosts.map(post => {
                  return (
                    <Post key={post.id} post={post}/>
                  )
                }) :
                <p className={styles.noposts}>Постов нет</p>
            }
            {
              postsLoading ? 'Загрузка...' : null
            }
          </section>
        </section>
        <HomeRightbar/>
      </main>
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
  await client.query({
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