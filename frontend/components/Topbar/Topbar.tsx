
import { FC } from 'react';
import styles from './topbar.module.scss';
import Image from 'next/image';
import {Search, Notifications} from '@material-ui/icons';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';


const Topbar: FC = () => {
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
                        <Image width="40" height="40" src='/imgs/default_user_logo.jpg' alt="icon" className={styles.userIcon} />
                        <span className={styles.username}>Гнида</span>
                        <KeyboardArrowDownIcon className={styles.downArrow}/>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;