
import { FC, memo } from 'react';
import {Search, Notifications} from '@material-ui/icons';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useLogout } from '../../apollo/mutations/logout';
import useAuthUser from '../../hooks/useAuthUser';

import styles from './topbar.module.scss';


const Topbar: FC = () => {
    const {authUser} = useAuthUser();
    const {logout} = useLogout();

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
                    <div className={styles.userIconBlock} onClick={() => logout()}>
                        <img width="40" height="40" src={
                            authUser?.getAuthUser?.profilePicture ? authUser.getAuthUser.profilePicture
                            : '/imgs/default_user_logo.jpg'
                        } alt="icon" className={styles.userIcon} />
                        <span className={styles.username}>{
                            authUser?.getAuthUser ? authUser.getAuthUser.name : null
                        }</span>
                        <KeyboardArrowDownIcon className={styles.downArrow}/>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default memo(Topbar);