
import {FC, useEffect} from 'react';
import A from '../A/A';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import MovieIcon from '@material-ui/icons/Movie';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import { useLazyQuery, useQuery } from '@apollo/client';
import { IAuthUser, IUser } from '../../models/user';
import getAuthUser from '../../apollo/queries/getAuthUser';
import getUser from '../../apollo/queries/getUser';

import styles from './sharePost.module.scss';


const SharePost: FC = () => {
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    let [getUserQuery, {data: authUserData}] = useLazyQuery<{getUser: IUser}>(getUser);

    useEffect(() => {
        if(authUser?.getAuthUser)
            getUserQuery({
                variables: {
                    userId: authUser.getAuthUser.id
                }
            });
    }, [authUser]);

    return (
        <section className={styles.sharePost}>
            <div className={styles.shareTop}>
                <A href="/profile">
                    <img className={styles.shareUserLogo} width="40" height="40" src={
                            authUserData?.getUser.profilePicture ? authUserData.getUser.profilePicture
                            : '/imgs/default_user_logo.jpg'
                    }/>
                </A>
                <textarea placeholder={
                    authUser?.getAuthUser ?
                    `Что нового, ${authUser.getAuthUser.name} ?`
                    : "Что нового ?"
                }></textarea>
            </div>
            <div className={styles.shareBottom}>
                <div className={styles.shareOptions}>
                    <div className={styles.shareOption}>
                        <PhotoLibraryIcon className={styles.optionIcon}/>
                        <span>Фото</span>
                    </div>
                    <div className={styles.shareOption}>
                        <MovieIcon className={styles.optionIcon}/>
                        <span>Видео</span>
                    </div>
                    <div className={styles.shareOption}>
                        <SentimentSatisfiedIcon className={styles.optionIcon}/>
                        <span>Эмоции</span>
                    </div>
                </div>
                <button>Добавить</button>
            </div>
        </section>
    );
};

export default SharePost;