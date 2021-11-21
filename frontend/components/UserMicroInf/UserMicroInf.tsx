import {FC, useState} from 'react';
import {memo} from 'react';
import { useRouter } from 'next/router';
import A from '../../components/A/A';
import Image from 'next/image';
import Subscribe from '../Subscribe/Subscribe';
import type { IUser } from '../../models/user';
import useAuthUser from '../../hooks/useAuthUser';

import styles from './userMicroInf.module.scss';


const UserMicroInf: FC<{user: IUser}> = ({user}) => {
    const {authUser} = useAuthUser();
    const isAuthUser = authUser?.getAuthUser?.id === user.id;
    
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
                : <Subscribe user={user}/>
            }
        </div>
    );
};

export default memo(UserMicroInf);