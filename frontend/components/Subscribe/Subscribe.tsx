import {FC, useState} from 'react';
import useUnfollowUser from '../../apollo/mutations/unfollowUser';
import useFollowUser from '../../apollo/mutations/followUser';

import styles from './subscribe.module.scss';

interface IProps{
    subscribe: boolean;
    userId: number;
}

const Subscribe: FC<IProps> = ({subscribe, userId}) => {
    const [subscribeFlag, setSubscribeFlag] = useState(subscribe);
    const {followUser} = useFollowUser(userId);
    const {unfollowUser} = useUnfollowUser(userId);

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
export default Subscribe;