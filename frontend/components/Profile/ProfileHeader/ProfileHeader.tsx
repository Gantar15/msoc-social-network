
import {FC, memo} from 'react';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';
import GavelIcon from '@material-ui/icons/Gavel';
import { useQuery } from '@apollo/client';
import useUnfollowUser from '../../../apollo/mutations/unfollowUser';
import useFollowUser from '../../../apollo/mutations/followUser';
import { IAuthUser, IUser } from '../../../models/user';
import getAuthUser from '../../../apollo/queries/getAuthUser';
import getUser from '../../../apollo/queries/getUser';

import styles from './profileHeader.module.scss';


interface IProps{
    userId: number;
}

const ProfileHeader: FC<IProps> = ({userId}) => {
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    let {data: userData} = useQuery<{getUser: IUser}>(getUser, {
        variables: {
            userId: userId
        }
    });
    const {followUser} = useFollowUser(userId);
    const {unfollowUser} = useUnfollowUser(userId);
    
    return (
        <header className={styles.profileHeader}>
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
                    {
                        userData?.getUser && authUser?.getAuthUser && userData?.getUser.id != authUser?.getAuthUser.id ?
                        (<button className={styles.unsubscribe}>
                            Отписаться
                        </button>)
                        : null
                    }
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