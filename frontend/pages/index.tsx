import type { NextPage, GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import MainContainer from '../components/MainContainer/MainContainer';
import SharePost from '../components/SharePost/SharePost';
import HomeRightbar from '../components/HomeRightbar/HomeRightbar';
import Post from '../components/Post/Post';
import {useRefresh} from '../apollo/mutations/refresh';
import client from '../apollo/client';
import validateRefreshToken from '../utils/validateRefreshToken';
import { useLazyQuery, useQuery } from '@apollo/client';
import getAllPosts from '../apollo/queries/getAllPosts';
import type {IGetAllPosts} from '../apollo/queries/getAllPosts';

import styles from '../public/styles/home.module.scss';


interface IProps{
  posts: IGetAllPosts,
  loading: boolean
}

const Home: NextPage<IProps> = () => {
  const {refresh} = useRefresh();
  const postsLimit = 20;
  const [postsOffset, setPostsOffset] = useState(0);
  const [getPosts, {data: posts, loading: postsLoading, error: postsError}] = useLazyQuery<IGetAllPosts>(getAllPosts, {
    variables: {
      limit: postsLimit,
      offset: postsOffset
    }
  });

  useEffect(() => {
    getPosts()
    refresh();
  }, []);

  return (
    <MainContainer activePage={2} title="Home">
      <section className={styles.homepage}>
        <section className={styles.news}>
          <SharePost/>
          <section className={styles.posts}>
            {postsLoading ? 'Загрузка...' 
              : posts?.getTimelinePosts?.length ? 
                posts.getTimelinePosts.map(post => {
                  return (
                    <Post key={post.id} post={post}/>
                  )
                }) :
                'Постов нет'
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

  // const {data: posts, loading} = await client.query<IGetAllPosts>({
  //   query: getAllPosts,
  //   variables: {
  //     limit: 20,
  //     offset: 0
  //   }
  // });

  return {
    props: {
      // posts,
      // loading
    }
  };
};