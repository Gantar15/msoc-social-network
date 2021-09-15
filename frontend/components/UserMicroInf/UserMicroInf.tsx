import type {FC} from 'react';
import {memo} from 'react';
import A from '../../components/A/A';
import Image from 'next/image';
import Subscribe from '../Subscribe/Subscribe';
import { IUser } from '../../models/user';

import styles from './userMicroInf.module.scss';


const UserMicroInf: FC<{user: IUser, isAuthUser: boolean}> = ({user, isAuthUser}) => {
    
    return (
        <div className={styles.userMicroInf}>
            <div className={styles.userInfo}>
                <A href={`/profile/${user.id}`}>
                    <div className={styles.avatar}>
                        <Image className={styles.img} src={
                            user.profilePicture ?? '/imgs/default_user_logo.jpg'
                        } width="10" height="10" layout="responsive"/>
                        <div className={styles.networkStatus + ' ' + styles.online}></div>
                    </div>
                </A>
                <A href={`/profile/${user.id}`}>
                    <span className={styles.name}>{user.name}</span>
                </A>
            </div>
            {
                isAuthUser ? null
                : <Subscribe subscribe={false} userId={user.id}/>
            }
        </div>
    );
};

export default memo(UserMicroInf);