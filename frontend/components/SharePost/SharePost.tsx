
import {FC, useEffect, useState, useRef} from 'react';
import A from '../A/A';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import MovieIcon from '@material-ui/icons/Movie';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import { useLazyQuery, useQuery } from '@apollo/client';
import { IAuthUser, IUser } from '../../models/user';
import getAuthUser from '../../apollo/queries/getAuthUser';
import getUser from '../../apollo/queries/getUser';
import useAddPost from '../../apollo/mutations/addPost';

import styles from './sharePost.module.scss';


const SharePost: FC = () => {
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    let [getUserQuery, {data: authUserData}] = useLazyQuery<{getUser: IUser}>(getUser);
    const [photo, setPhoto] = useState<null | FileList>(null);
    const [video, setVideo] = useState<null | FileList>(null);
    const descRef = useRef<HTMLTextAreaElement | null>(null);
    const photoRef = useRef<HTMLInputElement | null>(null);
    const videoRef = useRef<HTMLInputElement | null>(null);
    const {addPost} = useAddPost();

    useEffect(() => {
        if(authUser?.getAuthUser)
            getUserQuery({
                variables: {
                    userId: authUser.getAuthUser.id
                }
            });
    }, [authUser]);

    const submitHandler = () => {
        if(descRef.current){
            const videos = video?.length ? video : null;
            const imgs = photo?.length ? photo : null;
            console.log(descRef.current.value, imgs, videos)
            addPost(descRef.current.value, imgs, videos);
        }
    };

    return (
        <section className={styles.sharePost}>
            <div className={styles.shareTop}>
                <A href="/profile">
                    <img className={styles.shareUserLogo} width="40" height="40" src={
                            authUserData?.getUser.profilePicture ? authUserData.getUser.profilePicture
                            : '/imgs/default_user_logo.jpg'
                    }/>
                </A>
                <textarea ref={descRef} placeholder={
                    authUserData?.getUser ?
                    `Что нового, ${authUserData.getUser.name} ?`
                    : "Что нового ?"
                }></textarea>
            </div>
            <div className={styles.shareBottom}>
                <div className={styles.shareOptions}>
                    <div className={styles.shareOption} onClick={() => photoRef.current?.click()}>
                        <PhotoLibraryIcon className={styles.optionIcon}/>
                        <span>Фото</span>
                        <input ref={photoRef} style={{display: 'none'}} type="file" multiple accept=".png, .jpg, .gif, .jpeg, .svg, .webp"
                        onChange={
                            ev => {
                                if(ev.target.files && ev.target.validity.valid) setPhoto(ev.target.files)
                            }
                        }/>
                    </div>
                    <div className={styles.shareOption} onClick={() => videoRef.current?.click()}>
                        <MovieIcon className={styles.optionIcon}/>
                        <span>Видео</span>
                        <input ref={videoRef} style={{display: 'none'}} type="file" accept=".mp4, .webm, .ogv, .swf" multiple
                        onChange={
                            ev => {
                                if(ev.target.files && ev.target.validity.valid) setVideo(ev.target.files)
                            }
                        }/>
                    </div>
                    <div className={styles.shareOption}>
                        <SentimentSatisfiedIcon className={styles.optionIcon}/>
                        <span>Эмоции</span>
                    </div>
                </div>
                <button onClick={submitHandler}>Добавить</button>
            </div>
        </section>
    );
};

export default SharePost;