import type {FC} from 'react';
import {memo} from 'react';
import A from '../../components/A/A';
import Image from 'next/image';
import Subscribe from '../Subscribe/Subscribe';
import { IUser } from '../../models/user';

import styles from './userMicroInf.module.scss';


const UserMicroInf: FC<{user: IUser}> = ({user}) => {
    return (
        <div className={styles.userMicroInf}>
            <div className={styles.userInfo}>
                <A href="/profile/361">
                    <div className={styles.avatar}>
                        <Image className={styles.img} src="/imgs/photo1.jpg" width="10" height="10" layout="responsive"/>
                        <div className={styles.networkStatus + ' ' + styles.online}></div>
                    </div>
                </A>
                <A href="/profile/361">
                    <span className={styles.name}>Григорий</span>
                </A>
            </div>
            <Subscribe subscribe={false} userId={user.id}/>
        </div>
    );
};

export default memo(UserMicroInf);