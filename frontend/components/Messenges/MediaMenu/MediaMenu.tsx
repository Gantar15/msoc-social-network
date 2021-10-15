import {FC} from 'react';
import PhotoSizeSelectActualOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActualOutlined';
import VideoLibraryOutlinedIcon from '@material-ui/icons/VideoLibraryOutlined';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import AudiotrackOutlined from '@material-ui/icons/AudiotrackOutlined';

import styles from './mediaMenu.module.scss';


const MediaMenu: FC = () => {
    return (
        <section className={styles.mediaMenu}>
            <div>
                <div className={styles.mediaElement}>
                    <PhotoSizeSelectActualOutlinedIcon className={styles.icon}/>
                    <span>Фото</span>
                </div>
                <div className={styles.mediaElement}>
                    <VideoLibraryOutlinedIcon className={styles.icon}/>
                    <span>Видео</span>
                </div>
                <div className={styles.mediaElement}>
                    <InsertDriveFileOutlinedIcon className={styles.icon}/>
                    <span>Файл</span>
                </div>
                <div className={styles.mediaElement}>
                    <AudiotrackOutlined className={styles.icon}/>
                    <span>Аудио</span>
                </div>
                <div className={styles.bottomTriangle}></div>
            </div>
        </section>
    );
};

export default MediaMenu;