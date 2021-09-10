
import { FC, useEffect, memo } from 'react';
import {Search, Notifications} from '@material-ui/icons';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useLazyQuery, useQuery } from '@apollo/client';
import getUser from '../../apollo/queries/getUser';
import getAuthUser from '../../apollo/queries/getAuthUser';
import type { IAuthUser, IUser } from '../../models/user';

import styles from './topbar.module.scss';


const Topbar: FC = () => {
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
        <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
                <div className={styles.search}>
                    <Search className={styles.searchIcon}/>
                    <input type="text" placeholder="Поиск" />
                </div>
            </div>
            <div className={styles.topbarRight}>
                <div className={styles.userActivities}>
                    <div className={styles.topbarIcons}>
                        <div className={styles.topbarIcon}>
                            <Notifications className={styles.icon}/>
                            <div className={styles.topbarIconCounter}>3</div>
                        </div>
                    </div>
                    <div className={styles.userIconBlock}>
                        <img width="40" height="40" src={
                            authUserData?.getUser.profilePicture ? authUserData.getUser.profilePicture
                            : '/imgs/default_user_logo.jpg'
                        } alt="icon" className={styles.userIcon} />
                        <span className={styles.username}>{
                            authUserData?.getUser.name
                        }</span>
                        <KeyboardArrowDownIcon className={styles.downArrow}/>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default memo(Topbar);