
import {FC, useRef, memo, useState, useEffect} from 'react';
import Image from 'next/image';
import ShareIcon from '@material-ui/icons/Share';
import MessageIcon from '@material-ui/icons/Message';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import type {IPost} from '../../models/post';
import useLikePost from '../../apollo/mutations/likePost';
import useDislikePost from '../../apollo/mutations/dislikePost';
import A from '../A/A';
import PreloadVideo from '../PreloadVideo/PreloadVideo';
import moment from 'moment';
import 'moment/locale/ru';
import type { IAuthUser } from '../../models/user';
import {useQuery} from '@apollo/client';
import getAuthUser from '../../apollo/queries/getAuthUser';
import ImageElement from '../ImageElement/ImageElement';

import styles from './post.module.scss';


const Post: FC<{post: IPost}> = ({post}) => {
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);

    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const showMoreRef = useRef<HTMLDivElement>(null);
    const [like, setLike] = useState(post.likes.length);
    const [dislike, setDislike] = useState(post.dislikes.length);
    const [isLiked, setIsLiked] = useState(post.likes.some(userId => userId == authUser?.getAuthUser?.id));
    const [isDisliked, setIsDisliked] = useState(post.dislikes.some(userId => userId == authUser?.getAuthUser?.id));
    const {likePost} = useLikePost(post.id);
    const {dislikePost} = useDislikePost(post.id);

    const showMoreHandler = () => {
        if(descriptionRef.current && showMoreRef.current){
            descriptionRef.current.style.webkitLineClamp = 'unset';
            showMoreRef.current.style.display = 'none';
        }
    };

    useEffect(() => {
        if(descriptionRef?.current && showMoreRef?.current){
            descriptionRef.current.style.webkitLineClamp = 'unset';
            Math.ceil(
                descriptionRef.current.offsetHeight / Number.parseInt(
                    getComputedStyle(descriptionRef!.current!).lineHeight
                )
            ) <= 5 ? 
            showMoreRef.current.style.display = 'none' 
            : null;
            descriptionRef.current.style.webkitLineClamp = '';
        }
    }, [descriptionRef.current, showMoreRef.current]);

    function formateTime(date: string){
        moment.locale('ru');
        return moment(new Date(+date)).fromNow();
    }
    function likeHandler(){
        likePost();
        setLike(like => isLiked ? like-1 : like+1);
        setDislike(dislike => isDisliked ? dislike-1 : dislike);
        setIsLiked(isLiked => !isLiked);
        setIsDisliked(false);
    }
    function dislikeHandler(){
        dislikePost();
        setDislike(dislike => isDisliked ? dislike-1 : dislike+1);
        setLike(like => isLiked ? like-1 : like);
        setIsDisliked(isDisliked => !isDisliked);
        setIsLiked(false);
    }
    console.log(post)
    return (
        <section className={styles.post}>
            <header>
                <div className={styles.authorBlock}>
                    <A href={`/profile/${post.user.id}`} className={styles.authorImageBlock}>
                        {
                            post.user.profilePicture ? 
                            <Image width="45" height="45" className={styles.authorImage} src={post.user.profilePicture}/>
                            : <Image width="45" height="45" className={styles.authorImage} src={'/imgs/default_user_logo.jpg'}/>
                        }
                    </A>
                    <div className={styles.nameBlock}>
                        <A href={`/profile/${post.user.id}`}>
                            <span>{post.user.name}</span>
                        </A>
                        <time>{formateTime(post.createdAt)}</time>
                    </div>
                </div>
                <MoreHorizIcon className={styles.postOptions}/>
            </header>
            <section>
                {
                    post.desc ?
                        (<div className={styles.descriptionBlock}>
                            <p ref={descriptionRef}>
                                {post.desc}
                            </p>
                            {
                                post.desc ?
                                (<div ref={showMoreRef} onClick={showMoreHandler} className={styles.more} data-active>
                                    Читать дальше
                                </div>)
                                : null
                            }
                        </div>)
                        : null
                }
                {
                    post.imgs.length + post.videos.length + post.audios.length != 0 ?
                    (<div className={styles.postMediaContent}>
                        {
                            post.imgs.map((img, index) => {
                                return (
                                    <ImageElement key={index} src={img}/>
                                );
                            })
                        }
                        {
                            post.videos.map((video, index) => {
                                return (
                                    <PreloadVideo key={index} src={video}/>
                                );
                            })
                        }
                        {
                            post.audios.map((audio, index) => {
                                return (
                                    <audio style={{width: '100%'}} src={audio} key={index} controls></audio>
                                );
                            })
                        }
                    </div>)
                   : null 
                }
            </section>
            <footer>
                <ul className={styles.options}>
                    <li className={styles.option}>
                        <div>
                            <ShareIcon className={styles.icon}/>
                        </div>
                        <span className={styles.counter}>
                            {post.shareCount}
                        </span>
                    </li>
                    <li className={`${styles.option} ${styles.like} ${isLiked ? styles.active+' '+styles.click : ''}`}>
                        <div onClick={likeHandler}>
                            <ThumbUpAltIcon className={styles.icon}/>
                        </div>
                        <span className={styles.counter}>
                            {like}
                        </span>
                    </li>
                    <li className={`${styles.option} ${styles.dislike} ${isDisliked ? styles.active+' '+styles.click : ''}`}>
                        <div onClick={dislikeHandler}>
                            <ThumbDownAltIcon className={styles.icon}/>
                        </div>
                        <span className={styles.counter}>
                            {dislike}
                        </span>
                    </li>
                    <li className={styles.option}>
                        <div>
                            <MessageIcon className={styles.icon}/>
                        </div>
                        <span className={styles.counter}>
                            {post.comments.length}
                        </span>
                    </li>
                </ul>
            </footer>
        </section>
    );
};

export default memo(Post);