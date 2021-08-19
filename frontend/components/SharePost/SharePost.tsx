
import {FC} from 'react';
import Image from 'next/image';
import A from '../A/A';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import MovieIcon from '@material-ui/icons/Movie';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';

import styles from './sharePost.module.scss';


const SharePost: FC = () => {
    return (
        <section className={styles.sharePost}>
            <div className={styles.shareTop}>
                <A href="/profile">
                    <Image className={styles.shareUserLogo} width="40" height="40" src="/imgs/default_user_logo.jpg"/>
                </A>
                <textarea placeholder="Что нового, Гнида ?"></textarea>
            </div>
            <div className={styles.shareBottom}>
                <div className={styles.shareOptions}>
                    <div className={styles.shareOption}>
                        <PhotoLibraryIcon className={styles.optionIcon}/>
                        <span>Фото</span>
                    </div>
                    <div className={styles.shareOption}>
                        <MovieIcon className={styles.optionIcon}/>
                        <span>Видео</span>
                    </div>
                    <div className={styles.shareOption}>
                        <SentimentSatisfiedIcon className={styles.optionIcon}/>
                        <span>Эмоции</span>
                    </div>
                </div>
                <button>Добавить</button>
            </div>
        </section>
    );
};

export default SharePost;