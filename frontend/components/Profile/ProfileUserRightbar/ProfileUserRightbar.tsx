
import {FC} from 'react';
import Image from 'next/image';
import A from '../../../components/A/A';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import styles from './profileUserRightbar.module.scss';


interface IProps{
    title: string;
    count: number;
}

const ProfileUserRightbar: FC<IProps> = ({count, title}) => {
    return (
        <div className={styles.profileUserRightbar}>
            <header className={styles.titleBlock}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.indicator}>
                    <div>
                        <span>{count}</span> 
                        <PeopleAltIcon className={styles.icon}/>
                    </div>
                </div>
            </header>
            <section className={styles.users}>
                <div className={styles.user}>
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
                    <button className={styles.unsubscribe}>
                        Отписаться
                    </button>
                </div>
                <div className={styles.user}>
                    <div className={styles.userInfo}>
                        <A href="/profile/361">
                            <div className={styles.avatar}>
                                <Image className={styles.img} src="/imgs/post1-2.jpg" width="10" height="10" layout="responsive"/>
                                <div className={styles.networkStatus + ' ' + styles.offline}></div>
                            </div>
                        </A>
                        <A href="/profile/361">
                            <span className={styles.name}>Инакентий Валерьевич</span>
                        </A>
                    </div>
                    <button className={styles.subscribe}>
                            Подписаться
                    </button>
                </div>
            </section>
            <div className={styles.more}>
                <div>
                    <span>Смотреть все</span>
                    <KeyboardArrowRightIcon className={styles.icon}/>
                </div>
            </div>
        </div>
    );
};

export default ProfileUserRightbar;