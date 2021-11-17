import {FC, useEffect, useState, memo} from 'react';
import useUnfollowUser from '../../apollo/mutations/unfollowUser';
import useFollowUser from '../../apollo/mutations/followUser';
import type { IUser } from '../../models/user';
import useAuthUser from '../../hooks/useAuthUser';

import styles from './subscribe.module.scss';

interface IProps{
    user: IUser;
}

const Subscribe: FC<IProps> = ({user}) => {
    const {authUser} = useAuthUser();
    const [subscribeFlag, setSubscribeFlag] = useState<boolean | null>(null);
    const {followUser} = useFollowUser(user.id);
    const {unfollowUser} = useUnfollowUser(user.id);
    
    function isUserSubscribed(){
        if(authUser?.getAuthUser?.id)
            return user.followers?.some(id => +id === authUser!.getAuthUser!.id);
        return null;
    }

    useEffect(() => {
        setSubscribeFlag(isUserSubscribed());
    }, [user, authUser]);
    const followHandler = () => {
        if(!subscribeFlag)
            setSubscribeFlag(true);
        followUser();
    };
    const unfollowHandler = () => {
        if(subscribeFlag)
            unfollowUser();
        setSubscribeFlag(false);
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