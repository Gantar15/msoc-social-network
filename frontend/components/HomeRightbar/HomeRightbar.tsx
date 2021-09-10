
import {FC, memo} from 'react';

import styles from './homeRightbar.module.scss';


const HomeRightbar: FC = () => {
    return (
        <nav className={styles.homeRightbar}>
            <ul>
                <li className={styles.active}>
                    <div>
                        <span>Новости</span>
                        <div className={styles.counter}>+1340</div>
                    </div>
                </li>
                <li>
                    <div>
                        <span>Рекомендации</span>
                        <div className={styles.counter}>+659</div>
                    </div>
                </li>
                <li>
                    <div>
                        <span>Лайки</span>
                        <div className={styles.counter}>85</div>
                    </div>
                </li>
                <li>
                    <div>
                        <span>Комментарии</span>
                        <div className={styles.counter}>32</div>
                    </div>
                </li>
            </ul>
        </nav>
    );
};

export default memo(HomeRightbar); 