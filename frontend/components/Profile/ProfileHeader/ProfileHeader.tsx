
import {FC, memo, useState, useEffect} from 'react';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';
import GavelIcon from '@material-ui/icons/Gavel';
import { useQuery } from '@apollo/client';
import getUser, { getUser_Query } from '../../../apollo/queries/getUser';
import useUnfollowUser from '../../../apollo/mutations/unfollowUser';
import useFollowUser from '../../../apollo/mutations/followUser';
import TelegramIcon from '@material-ui/icons/Telegram';
import A from '../../A/A';
import ArrowBackIosSharp from '@material-ui/icons/ArrowBackIosSharp';
import useAuthUser from '../../../hooks/useAuthUser';

import styles from './profileHeader.module.scss';


interface IProps{
    userId: number;
    setIsShowCallModal: Function;
}

const ProfileHeader: FC<IProps> = ({userId, setIsShowCallModal}) => {
    const [isSubscribe, setIsSubscribe] = useState(false);
    const {authUser} = useAuthUser();
    let {data: userData} = useQuery<getUser_Query>(getUser, {
        variables: {
            userId: userId
        }
    });
    const {followUser} = useFollowUser(userId);
    const {unfollowUser} = useUnfollowUser(userId);
    const isAuthUserProfile = userData?.getUser && authUser?.getAuthUser && userData?.getUser.id === authUser?.getAuthUser?.id;

    useEffect(() => {
        if(userData?.getUser && authUser?.getAuthUser){
            setIsSubscribe(userData.getUser.followers.includes(authUser.getAuthUser.id.toString()))
        }
    }, [authUser, userData]);

    const followHandler = () => {
        followUser();
        setIsSubscribe(true);
    };
    const unfollowHandler = () => {
        unfollowUser();
        setIsSubscribe(false);
    };
    
    return (
        <header className={styles.profileHeader + (isAuthUserProfile ? ' '+styles.authUserProfile : '')}>
            <div className={styles.profileOptions}>
                <div className={styles.option}>
                    <span>Настройки</span>
                    <SettingsIcon className={styles.icon}/>
                </div>
                <div className={styles.option}>
                    <span>Изменить</span>
                    <EditIcon className={styles.icon}/>
                </div>
                <div className={styles.option}>
                    <span>Дейсвия</span>
                    <GavelIcon className={styles.icon}/>
                </div>
            </div>
            <div className={styles.userIconBlock}>
                <div className={styles.avatarBlock}>
                    <div>
                        <div className={styles.networkStatus}></div>
                        <img className={styles.avatar} src="/imgs/default_user_logo.jpg"/>
                    </div>
                </div>
                <div className={styles.nameBlock}>
                    <span className={styles.name}>{userData?.getUser.name}</span>
                    <div className={styles.subscribeBlock}>
                        <div>
                            {
                                !isAuthUserProfile && userData?.getUser && authUser?.getAuthUser ?
                                isSubscribe ? 
                                    (<button className={styles.unsubscribe} onClick={unfollowHandler}>
                                        Отписаться
                                    </button>)
                                    :(<button className={styles.subscribe} onClick={followHandler}>
                                        Подписаться
                                    </button>)
                                : null
                            }
                            {
                                !isAuthUserProfile && userData?.getUser && authUser?.getAuthUser ?
                                (<A href={`/messenger/${userId}`} className={styles.sendMessenge}>
                                    <TelegramIcon className={styles.icon}/>
                                </A>)
                                : null
                            }
                        </div>
                        {
                            !isAuthUserProfile && userData?.getUser && authUser?.getAuthUser ?
                            (<button className={styles.call} onClick={() => setIsShowCallModal(true)}>
                                <p>Позвонить</p>
                                <ArrowBackIosSharp className={styles.icon}/>
                            </button>)
                            : null
                        }
                    </div>
                </div>
            </div>
            <div className={styles.userInfoBlock}>
                <div className={styles.userInfoItem}>
                    <div>
                        <span className={styles.infoName}>
                            Город:
                        </span>
                        <span className={styles.info}>
                            {
                                userData?.getUser.city ?? '...'
                            }
                        </span>
                    </div>
                </div>
                <div className={styles.userInfoItem}>
                    <div>
                        <span className={styles.infoName}>
                            Родина:
                        </span>
                        <span className={styles.info}>
                            {
                                userData?.getUser.city ?? '...'
                            }
                        </span>
                    </div>
                </div>
                <div className={styles.userInfoItem}>
                    <div>
                        <span className={styles.infoName}>
                            Отношения:
                        </span>
                        <span className={styles.info}>
                            {
                                userData?.getUser.relationship ?? '...'
                            }
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default memo(ProfileHeader);