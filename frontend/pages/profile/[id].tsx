import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import MainContainer from "../../components/MainContainer/MainContainer";
import ProfileHeader from "../../components/Profile/ProfileHeader/ProfileHeader";
import Post from '../../components/Post/Post';
import SubjectIcon from '@material-ui/icons/Subject';
import SharePost from '../../components/SharePost/SharePost';
import ProfileUserRightbar from "../../components/Profile/ProfileUserRightbar/ProfileUserRightbar";
import { useEffect, useState } from 'react';
import { useRefresh } from '../../apollo/mutations/refresh';
import { useQuery } from '@apollo/client';
import getUserPosts, {getUserPosts_Query} from '../../apollo/queries/getUserPosts';
import getUserPostsCount, {userPostsCount_Query} from '../../apollo/queries/getUserPostsCount';
import getFollowers, {getFollowers_Query} from '../../apollo/queries/getFollowers';
import getFollowins, {getFollowins_Query} from '../../apollo/queries/getFollowins';
import getFollowersCount, {getFollowersCount_Query} from '../../apollo/queries/getFollowersCount';
import getFollowinsCount, {getFollowinsCount_Query} from '../../apollo/queries/getFollowinsCount';
import apolloClient from '../../apollo/client';
import validateRefreshToken from '../../utils/validateRefreshToken';
import CallModal from '../../components/CallModal/CallModal';
import useAuthUser from '../../hooks/useAuthUser';

import styles from '../../public/styles/profile.module.scss';


const Profile: NextPage = () => {
    const router = useRouter();
    const profileUserId: number = +router.query.id!;
    
    const {refresh} = useRefresh();
    const {authUser} = useAuthUser();

    useEffect(() => {
        refresh();
    }, []);

    const postsLimit = 20;
    const [postsOffset, setPostsOffset] = useState(0);
    const {data: posts, loading: postsLoading} = useQuery<getUserPosts_Query>(getUserPosts, {
        variables: {
            userId: profileUserId,
            limit: postsLimit,
            offset: postsOffset
        }
    });
    const {data: followersCount} = useQuery<getFollowersCount_Query>(getFollowersCount, {
        variables: {
            userId: profileUserId
        }
    });
    const {data: followinsCount} = useQuery<getFollowinsCount_Query>(getFollowinsCount, {
        variables: {
            userId: profileUserId
        }
    });
    const {data: followersData} = useQuery<getFollowers_Query>(getFollowers, {
        variables: {
            userId: profileUserId,
            offset: 0,
            limit: 5
        }
    });
    const {data: followinsData} = useQuery<getFollowins_Query>(getFollowins, {
        variables: {
            userId: profileUserId,
            offset: 0,
            limit: 5
        }
    });
    const {data: userPostsCount} = useQuery<userPostsCount_Query>(getUserPostsCount, {
        variables: {
            userId: profileUserId
        }
    });
    const [isShowCallModal, setIsShowCallModal] = useState(false);
    
    return (
        <MainContainer activePage={1} title="Profile">
            <main className={styles.profile}>
                {
                    isShowCallModal ? <CallModal roomId={profileUserId} isShowCallModal={isShowCallModal} setIsShowCallModal={setIsShowCallModal}/> : null
                }
                <ProfileHeader userId={profileUserId} setIsShowCallModal={setIsShowCallModal}/>
                <section className={styles.mainContent}>
                    <section>
                        { authUser?.getAuthUser?.id ?
                            authUser.getAuthUser.id == profileUserId ? <SharePost limit={postsLimit}/> : null
                            : null
                        }
                        <div className={styles.postsBlock}>
                            <header className={styles.filters}>
                                <div className={styles.filter + ' ' + styles.active}>
                                    <span>Самые новые</span>
                                    <div></div>
                                </div>
                                <div className={styles.filter}>
                                    <span>Самые популярные</span>
                                    <div></div>
                                </div>
                                <div className={styles.postsCounter}>
                                    <SubjectIcon className={styles.icon}/>
                                    <span>{
                                        userPostsCount?.getUserPostsCount 
                                    }</span>
                                </div>
                            </header>
                            <div className={styles.posts}>
                                {   
                                    postsLoading ? <div>Загрузка...</div>
                                    : posts?.getUserPosts.length ?
                                    posts.getUserPosts.map(post => {
                                        return (
                                            <Post key={post.id} post={post}/>
                                        )
                                    })
                                    : <p className={styles.noposts}>Постов нет</p>
                                }
                            </div>
                        </div>
                    </section>

                    <section>
                        {
                            !followersCount ?
                                null
                                : !followersData ? null : <ProfileUserRightbar title={'Подписчики'} users={followersData.getFollowers} count={followersCount.getFollowersCount}/>
                        }

                        {
                            !followinsCount ?
                                null
                                : !followinsData ? null : <ProfileUserRightbar title={'Подписки'} users={followinsData.getFollowins} count={followinsCount.getFollowinsCount}/>
                        }
                    </section>
                </section>
            </main>
        </MainContainer>
    );
};  
export default Profile;

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
    const userId = +query.id!;
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
        query: getFollowers, 
        variables: {
            userId,
            offset: 0,
            limit: 5
        }
    });
    await client.query({
        query: getFollowins, 
        variables: {
            userId,
            offset: 0,
            limit: 5
        }
    });
    await client.query({
        query: getUserPostsCount, 
        variables: {
            userId
        }
    });
    await client.query({
        query: getFollowersCount, 
        variables: {
            userId
        }
    });
    await client.query({
        query: getFollowinsCount, 
        variables: {
            userId
        }
    });
    await client.query({
        query: getUserPosts, 
        variables: {
            userId,
            offset: 0,
            limit: 20
        }
    });
    
    return {
      props: {
        apolloState: client.cache.extract()
      }
    };
};