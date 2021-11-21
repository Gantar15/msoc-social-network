import {FC, useEffect, useState, memo} from 'react';
import useUnfollowUser from '../../apollo/mutations/unfollowUser';
import useFollowUser from '../../apollo/mutations/followUser';
import type { IUser } from '../../models/user';
import useAuthUser from '../../hooks/useAuthUser';

import styles from './subscribe.module.scss';
import { useRouter } from 'next/router';

interface IProps{
    user: IUser;
}

const Subscribe: FC<IProps> = ({user}) => {
    const router = useRouter();
    const profileUserId = +router.query.id!;
    const {authUser} = useAuthUser();
    const [subscribeFlag, setSubscribeFlag] = useState<boolean | null>(null);
    const {followUser} = useFollowUser(user.id, profileUserId);
    const {unfollowUser} = useUnfollowUser(user.id, profileUserId);
    
    function isUserSubscribed(){
        if(authUser?.getAuthUser?.id)
            return authUser!.getAuthUser.followins.some(id => id === user.id);
        return null;
    }

    useEffect(() => {
        setSubscribeFlag(isUserSubscribed());
    }, [user, authUser]);
    const followHandler = () => {
        setSubscribeFlag(true);
        followUser();
    };
    const unfollowHandler = () => {
        setSubscribeFlag(false);
        unfollowUser();
    };

    if(subscribeFlag === null){
        return <button className={styles.subscribe}></button>;
    }
    if(!subscribeFlag){
        return (
            <button onClick={followHandler} className={styles.subscribe+' '+styles.subscribe_button}>
                Подписаться
            </button>
        )
    }
    else{
        return (
            <button onClick={unfollowHandler} className={styles.unsubscribe+' '+styles.subscribe_button}>
                Отписаться
            </button>
        )
    }
};
export default memo(Subscribe);