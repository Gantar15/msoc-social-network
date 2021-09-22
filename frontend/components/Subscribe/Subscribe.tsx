import {FC, useEffect, useState, memo} from 'react';
import useUnfollowUser from '../../apollo/mutations/unfollowUser';
import useFollowUser from '../../apollo/mutations/followUser';
import { IAuthUser, IUser } from '../../models/user';
import { useQuery } from '@apollo/client';
import getAuthUser from '../../apollo/queries/getAuthUser';

import styles from './subscribe.module.scss';

interface IProps{
    user: IUser;
}

const Subscribe: FC<IProps> = ({user}) => {
    function isUserSubscribed(){
        return user.followers?.some(id => +id === authUser?.getAuthUser?.id);
    }

    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);

    const [subscribeFlag, setSubscribeFlag] = useState(isUserSubscribed());
    const {followUser} = useFollowUser(user.id);
    const {unfollowUser} = useUnfollowUser(user.id);

    useEffect(() => {
        setSubscribeFlag(isUserSubscribed());
    }, [user]);
    const followHandler = () => {
        followUser();
        setSubscribeFlag(false);
    };
    const unfollowHandler = () => {
        unfollowUser();
        setSubscribeFlag(true);
    };

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