import {FC, useRef, useEffect} from 'react';
import PhotoSizeSelectActualOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActualOutlined';
import VideoLibraryOutlinedIcon from '@material-ui/icons/VideoLibraryOutlined';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import AudiotrackOutlined from '@material-ui/icons/AudiotrackOutlined';

import styles from './mediaMenu.module.scss';


interface IProps{
    setVideos: Function;
    setImgs: Function;
    setDocuments: Function;
    setAudios: Function;
    setIsShowMediaMenu: Function;
}

const MediaMenu: FC<IProps> = (props) => {
    const {setVideos, setImgs,
        setDocuments, setAudios,
        setIsShowMediaMenu} = props;
    const photoRef = useRef<HTMLInputElement | null>(null);
    const videoRef = useRef<HTMLInputElement | null>(null);
    const audioRef = useRef<HTMLInputElement | null>(null);
    const documentRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const clickOutOfMenuHandler = (ev: any) => {
            if(!ev.target.closest('[data-media-menu]'))
                setIsShowMediaMenu(false);
        }
        document.addEventListener('click', clickOutOfMenuHandler);

        return () => {
            document.removeEventListener('click', clickOutOfMenuHandler);
        }
    }, [])

    return (
        <section data-media-menu className={styles.mediaMenu}>
            <div>
                <div className={styles.mediaElement} onClick={() => photoRef.current?.click()}>
                    <PhotoSizeSelectActualOutlinedIcon className={styles.icon}/>
                    <span>Фото</span>
                    <input ref={photoRef} style={{display: 'none'}} type="file" multiple accept="image/*"
                        onChange={
                            ev => {
                                if(ev.target.files && ev.target.validity.valid) setImgs(ev.target.files)
                            }
                        }/>
                </div>
                <div className={styles.mediaElement} onClick={() => videoRef.current?.click()}>
                    <VideoLibraryOutlinedIcon className={styles.icon}/>
                    <span>Видео</span>
                    <input ref={videoRef} style={{display: 'none'}} type="file" multiple accept="video/*"
                        onChange={
                            ev => {
                                if(ev.target.files && ev.target.validity.valid) setVideos(ev.target.files)
                            }
                        }/>
                </div>
                <div className={styles.mediaElement} onClick={() => documentRef.current?.click()}>
                    <InsertDriveFileOutlinedIcon className={styles.icon}/>
                    <span>Файл</span>
                    <input ref={documentRef} style={{display: 'none'}} type="file" multiple accept="*/txt"
                        onChange={
                            ev => {
                                if(ev.target.files && ev.target.validity.valid) setDocuments(ev.target.files)
                            }
                        }/>
                </div>
                <div className={styles.mediaElement} onClick={() => audioRef.current?.click()}>
                    <AudiotrackOutlined className={styles.icon}/>
                    <span>Аудио</span>
                    <input ref={audioRef} style={{display: 'none'}} type="file" multiple accept="audio/*"
                        onChange={
                            ev => {
                                if(ev.target.files && ev.target.validity.valid) setAudios(ev.target.files)
                            }
                        }/>
                </div>
                <div className={styles.bottomTriangle}></div>
            </div>
        </section>
    );
};

export default MediaMenu;