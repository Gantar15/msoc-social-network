import {FC, useEffect, useState, useRef, memo} from 'react';
import A from '../A/A';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import MovieIcon from '@material-ui/icons/Movie';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import useAddPost from '../../apollo/mutations/addPost';
import useAuthUser from '../../hooks/useAuthUser';

import styles from './sharePost.module.scss';


interface IProps{
    limit: number;
}

const SharePost: FC<IProps> = ({limit}) => {
    const {authUser} = useAuthUser();
    const [photo, setPhoto] = useState<null | FileList>(null);
    const [video, setVideo] = useState<null | FileList>(null);
    const [audio, setAudio] = useState<null | FileList>(null);
    const descRef = useRef<HTMLTextAreaElement | null>(null);
    const photoRef = useRef<HTMLInputElement | null>(null);
    const videoRef = useRef<HTMLInputElement | null>(null);
    const audioRef = useRef<HTMLInputElement | null>(null);
    const {addPost} = useAddPost();
    let [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(error)
            setTimeout(() => setError(null), 5500);
    }, [error]);

    const submitHandler = () => {
        if(descRef.current){
            const videos = video?.length ? video : null;
            const audios = audio?.length ? audio : null;
            const imgs = photo?.length ? photo : null;
            const desc = descRef.current.value;

            if(!videos && !imgs && !desc && !audios)
                return;
            if(videos){
                for (let i = 0; i < videos.length; i++) {
                    const video = videos[i];
                    const mbSize = +(video.size/1073741824).toFixed(1);
                    if(mbSize > 3) return setError('Размер видео не должен превышать 3Гб');
                }
            }
            if(imgs){
                for (let i = 0; i < imgs.length; i++) {
                    const img = imgs[i];
                    const mbSize = +(img.size/1048576).toFixed(1);
                    if(mbSize > 12) return setError('Размер изображения не должен превышать 12Мб');
                }
            }
            if(audios){
                for (let i = 0; i < audios.length; i++) {
                    const audio = audios[i];
                    const mbSize = +(audio.size/1048576).toFixed(1);
                    if(mbSize > 32) return setError('Размер аудио не должен превышать 32Мб');
                }
            }
            let videosLength = 0, imgsLength = 0, audiosLength = 0;
            if(imgs) imgsLength = imgs.length;
            if(videos) videosLength = videos.length;
            if(audios) audiosLength = audios.length;
            if(imgsLength + videosLength + audiosLength > 10)
                return setError('Нельзя прикрепить больше десяти файлов');

            addPost(limit, desc, imgs, videos, audios);

            descRef.current!.value = '';
            photoRef.current!.value = '';
            videoRef.current!.value = '';
            audioRef.current!.value = '';
        }
    };

    return (
        <section className={styles.sharePost}>
            {
                error ? <p>{error}</p> : null
            }
            <div className={styles.shareTop}>
                {
                    authUser?.getAuthUser ? 
                        <A href={`/profile/${authUser!.getAuthUser.id}`}>
                            <img className={styles.shareUserLogo} width="40" height="40" src={
                                    authUser!.getAuthUser.profilePicture ? authUser!.getAuthUser.profilePicture
                                    : '/imgs/default_user_logo.jpg'
                            }/>
                        </A>
                    : null
                 }
                <textarea ref={descRef} placeholder={
                    authUser?.getAuthUser ?
                    `Что нового, ${authUser.getAuthUser.name}?`
                    : "Что нового ?"
                }></textarea>
            </div>
            <div className={styles.shareBottom}>
                <div className={styles.shareOptions}>
                    <div className={styles.shareOption} onClick={() => photoRef.current?.click()}>
                        <PhotoLibraryIcon className={styles.optionIcon}/>
                        <input ref={photoRef} style={{display: 'none'}} type="file" multiple accept="image/*"
                        onChange={
                            ev => {
                                if(ev.target.files && ev.target.validity.valid) setPhoto(ev.target.files)
                            }
                        }/>
                    </div>
                    <div className={styles.shareOption} onClick={() => videoRef.current?.click()}>
                        <MovieIcon className={styles.optionIcon}/>
                        <input ref={videoRef} style={{display: 'none'}} type="file" accept="video/*" multiple
                        onChange={
                            ev => {
                                if(ev.target.files && ev.target.validity.valid) setVideo(ev.target.files)
                            }
                        }/>
                    </div>
                    <div className={styles.shareOption} onClick={() => audioRef.current?.click()}>
                        <AudiotrackIcon className={styles.optionIcon}/>
                        <input ref={audioRef} style={{display: 'none'}} type="file" accept="audio/*" multiple
                        onChange={
                            ev => {
                                if(ev.target.files && ev.target.validity.valid) setAudio(ev.target.files)
                            }
                        }/>
                    </div>
                    <div className={styles.shareOption}>
                        <SentimentSatisfiedIcon className={styles.optionIcon}/>
                    </div>
                </div>
                <button onClick={submitHandler}>Добавить</button>
            </div>
        </section>
    );
};

export default memo(SharePost);