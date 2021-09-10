import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import MainContainer from "../../components/MainContainer/MainContainer";
import ProfileHeader from "../../components/Profile/ProfileHeader/ProfileHeader";
import Post from '../../components/Post/Post';
import SubjectIcon from '@material-ui/icons/Subject';
import SharePost from '../../components/SharePost/SharePost';
import ProfileUserRightbar from "../../components/Profile/ProfileUserRightbar/ProfileUserRightbar";
import validateRefreshToken from '../../utils/validateRefreshToken';
import { useEffect, useState } from 'react';
import { useRefresh } from '../../apollo/mutations/refresh';
import { useQuery, useLazyQuery } from '@apollo/client';
import getUserPosts from '../../apollo/queries/getUserPosts';
import type {IGetUserPosts} from '../../apollo/queries/getUserPosts';
import { IAuthUser, IUser } from '../../models/user';
import getAuthUser from '../../apollo/queries/getAuthUser';
import getUser from '../../apollo/queries/getUser';

import styles from '../../public/styles/profile.module.scss';


const Profile: NextPage = () => {
    const router = useRouter();
    const profileUserId = router.query.id;

    const {refresh} = useRefresh();
    const postsLimit = 20;
    const [postsOffset, setPostsOffset] = useState(0);
    const {data: posts, loading: postsLoading, error: postsError} = useQuery<IGetUserPosts>(getUserPosts, {
        variables: {
            userId: +profileUserId!,
            limit: postsLimit,
            offset: postsOffset
        }
    });
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    let [getUserQuery, {data: authUserData}] = useLazyQuery<{getUser: IUser}>(getUser);

    useEffect(() => {
        refresh();
    }, []);
    useEffect(() => {
        if(authUser?.getAuthUser)
            getUserQuery({
                variables: {
                    userId: authUser.getAuthUser.id
                }
            });
    }, [authUser]); 

    return (
        <MainContainer activePage={1} title="Profile">
            <main className={styles.profile}>
                <ProfileHeader userId={+profileUserId!}/>
                <section className={styles.mainContent}>
                    <section>
                        <SharePost/>
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
                                    <span>76</span>
                                </div>
                            </header>
                            <div className={styles.posts}>
                                { postsLoading ? <div>Загрузка...</div>
                                  : posts?.getUserPosts ?
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
                        <ProfileUserRightbar title={'Подписчики'} count={657}/>

                        <ProfileUserRightbar title={'Подписки'} count={132}/>
                    </section>
                </section>
            </main>
        </MainContainer>
    );
};

export default Profile;

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