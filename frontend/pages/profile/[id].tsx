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
import { useQuery, useLazyQuery } from '@apollo/client';
import getUserPosts, {getUserPosts_Query} from '../../apollo/queries/getUserPosts';
import { IAuthUser } from '../../models/user';
import getAuthUser from '../../apollo/queries/getAuthUser';
import getUserPostsCount, {userPostsCount_Query} from '../../apollo/queries/getUserPostsCount';
import getFollowers, {getFollowers_Query} from '../../apollo/queries/getFollowers';
import getFollowins, {getFollowins_Query} from '../../apollo/queries/getFollowins';
import getFollowersCount, {getFollowersCount_Query} from '../../apollo/queries/getFollowersCount';
import getFollowinsCount, {getFollowinsCount_Query} from '../../apollo/queries/getFollowinsCount';
import apolloClient from '../../apollo/client';
import validateRefreshToken from '../../utils/validateRefreshToken';

import styles from '../../public/styles/profile.module.scss';


const Profile: NextPage = () => {
    const router = useRouter();
    const profileUserId: number = +router.query.id!;
    
    const {refresh} = useRefresh();
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);

    const postsLimit = 20;
    const [postsOffset, setPostsOffset] = useState(0);
    const {data: posts, loading: postsLoading} = useQuery<getUserPosts_Query>(getUserPosts, {
        variables: {
            userId: profileUserId,
            limit: postsLimit,
            offset: postsOffset
        }
    });
    const [followersCountExecute, {data: followersCount}] = useLazyQuery<getFollowersCount_Query>(getFollowersCount);
    const [followinsCountExecute, {data: followinsCount}] = useLazyQuery<getFollowinsCount_Query>(getFollowinsCount);
    const [getFollowersExecute, {data: followersData}] = useLazyQuery<getFollowers_Query>(getFollowers);
    const [getFollowinsExecute, {data: followinsData}] = useLazyQuery<getFollowins_Query>(getFollowins);
    const [userPostsCountExecute, {data: userPostsCount}] = useLazyQuery<userPostsCount_Query>(getUserPostsCount);

    useEffect(() => {
        refresh();
        followersCountExecute({
            variables: {
                userId: profileUserId
            }
        });
        followinsCountExecute({
            variables: {
                userId: profileUserId
            }
        });
        getFollowersExecute({variables: {
            userId: profileUserId,
            offset: 0,
            limit: 5
        }});
        getFollowinsExecute({variables: {
            userId: profileUserId,
            offset: 0,
            limit: 5
        }});
        userPostsCountExecute({variables: {
            userId: profileUserId
        }});
    }, [profileUserId]);

    return (
        <MainContainer activePage={1} title="Profile">
            <main className={styles.profile}>
                <ProfileHeader userId={profileUserId}/>
                <section className={styles.mainContent}>
                    <section>
                        { authUser?.getAuthUser?.id ?
                            authUser?.getAuthUser.id == profileUserId ? <SharePost/> : null
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
                                    : 'Постов нет'
                                }
                            </div>
                        </div>
                    </section>

                    <section>
                        {
                            !followersCount ?
                                'Загрузка...'
                                : !followersData ? null : <ProfileUserRightbar title={'Подписчики'} users={followersData.getFollowers} count={followersCount.getFollowersCount}/>
                        }

                        {
                            !followinsCount ?
                                'Загрузка...'
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
    
    const client = apolloClient();
    client.watchQuery({
        query: getFollowers, variables: {
            userId,
            offset: 0,
            limit: 5
        }, fetchPolicy: 'cache-and-network'
    });
    client.watchQuery({
        query: getFollowins, variables: {
            userId,
            offset: 0,
            limit: 5
        }, fetchPolicy: 'cache-and-network'
    });
    await client.query({
        query: getUserPostsCount, variables: {
            userId
        }
    });
    client.watchQuery({
        query: getFollowersCount, variables: {
            userId
        }, fetchPolicy: 'cache-and-network'
    });
    client.watchQuery({
        query: getFollowinsCount, variables: {
            userId
        }, fetchPolicy: 'cache-and-network'
    });
    client.watchQuery({
        query: getUserPosts, variables: {
            userId,
            offset: 0,
            limit: 20
        }, fetchPolicy: 'cache-and-network'
    });

    return {
      props: {
        apolloState: client.cache.extract()
      }
    };
};