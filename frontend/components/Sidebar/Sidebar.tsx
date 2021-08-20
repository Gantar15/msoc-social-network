
import {FC, useState} from 'react';
import Image from 'next/image';
import A from '../A/A';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import CallToActionIcon from '@material-ui/icons/CallToAction';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import VideocamIcon from '@material-ui/icons/Videocam';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

import styles from './sidevar.module.scss';


interface IProps {
    activePage: number;
};

const Sidebar: FC<IProps> = ({activePage}) => {
    function isActivePage(id: number){
        return activePage === id ? styles.active : '';
    }
    
    return (
        <aside className={styles.sidebar}>
            <A href="/">
                <section className={styles.logoBlock}>
                    <Image className={styles.logoImage} width="35" height="35" src="/imgs/main_logo.png"></Image>
                    <span>Msoc</span>
                </section>
            </A>
            <nav className={styles.navBlock}>
                <A href="/profile/1" className={`${styles.navItem} ${isActivePage(1)}`}>
                    <AccountCircleIcon className={styles.navIcon}/>
                    <span>Моя страница</span>
                </A>
                <A href="/" className={`${styles.navItem} ${isActivePage(2)}`}>
                    <CallToActionIcon className={styles.navIcon}/>
                    <span>Новости</span>
                </A>
                <A href="/messages" className={`${styles.navItem} ${isActivePage(3)}`}>
                    <QuestionAnswerIcon className={styles.navIcon}/>
                    <span>Сообщения</span>
                    <p className={styles.navItemCounter}>11</p>
                </A>
                <A href="/friends" className={`${styles.navItem} ${isActivePage(4)}`}>
                    <PeopleAltIcon className={styles.navIcon}/>
                    <span>Друзья</span>
                    <p className={styles.navItemCounter}>135</p>
                </A>
                <A href="/video" className={`${styles.navItem} ${isActivePage(5)}`}>
                    <VideocamIcon className={styles.navIcon}/>
                    <span>Видео</span>
                </A>
                <A href="/photo" className={`${styles.navItem} ${isActivePage(6)}`}>
                    <PhotoCameraIcon className={styles.navIcon}/>
                    <span>Фото</span>
                </A>
            </nav>
        </aside>
    );
};

export default Sidebar;