
import {FC, memo} from 'react';
import Image from 'next/image';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';
import GavelIcon from '@material-ui/icons/Gavel';
import A from '../../A/A';

import styles from './profileHeader.module.scss';


interface IProps{
    userId: number;
}

const ProfileHeader: FC<IProps> = ({userId}) => {
    return (
        <header className={styles.profileHeader}>
            <div className={styles.profileOptions}>
                <div className={styles.option}>
                    <span>Настройки</span>
                    <SettingsIcon className={styles.icon}/>
                </div>
                <div className={styles.option}>
                    <span>Изменить</span>
                    <EditIcon className={styles.icon}/>
                </div>
                <div className={styles.option}>
                    <span>Дейсвия</span>
                    <GavelIcon className={styles.icon}/>
                </div>
            </div>
            <div className={styles.userIconBlock}>
                <div className={styles.avatarBlock}>
                    <div>
                        <div className={styles.networkStatus}></div>
                        <Image className={styles.avatar} width="120" height="120" layout="responsive" src="/imgs/default_user_logo.jpg"/>
                    </div>
                </div>
                <div className={styles.nameBlock}>
                    <span className={styles.name}>Павловский Егор Николаевич</span>
                    <button className={styles.unsubscribe}>
                        Отписаться
                    </button>
                </div>
            </div>
            <div className={styles.userInfoBlock}>
                <div className={styles.userInfoItem}>
                    <div>
                        <span className={styles.infoName}>
                            Город:
                        </span>
                        <span className={styles.info}>
                            Львов
                        </span>
                    </div>
                </div>
                <div className={styles.userInfoItem}>
                    <div>
                        <span className={styles.infoName}>
                            Родина:
                        </span>
                        <span className={styles.info}>
                            Казахстан ул.Эйбой д.112 к.23
                        </span>
                    </div>
                </div>
                <div className={styles.userInfoItem}>
                    <div>
                        <span className={styles.infoName}>
                            Отношения:
                        </span>
                        <span className={styles.info}>
                            Отношения (хочу шаверму очень сильно)
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default memo(ProfileHeader);