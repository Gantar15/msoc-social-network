
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
                <input placeholder="Что нового, Гнида ?"></input>
                <button>Добавить</button>
            </div>
            <div className={styles.shareBottom}>
                <div className={styles.shareOptins}>
                    <PhotoLibraryIcon className={styles.optionIcon}/>
                    <MovieIcon className={styles.optionIcon}/>
                    <SentimentSatisfiedIcon className={styles.optionIcon}/>
                </div>
            </div>
        </section>
    );
};

export default SharePost;