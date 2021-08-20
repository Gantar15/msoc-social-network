
import {FC, useRef, memo, useState} from 'react';
import Image from 'next/image';
import ShareIcon from '@material-ui/icons/Share';
import MessageIcon from '@material-ui/icons/Message';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import A from '../A/A';
import moment from 'moment';
import 'moment/locale/ru';
import styles from './post.module.scss';


interface IPost{
    id: number;
    user: {
        id: number,
        name: string,
        profilePicture: string
    };
    desc: string;
    imgs: string[];
    likes: number[];
    dislikes: number[];
    commentsCount: number;
    createdAt: string;
    shareCount: number;
}

const Post: FC<{post: IPost}> = ({post}) => {
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const showMoreRef = useRef<HTMLDivElement>(null);
    const [like, setLike] = useState(post.likes.length);
    const [dislike, setDislike] = useState(post.dislikes.length);
    const [isLiked, setIsLiked] = useState(post.likes.some(userId => userId == 1));
    const [isDisliked, setIsDisliked] = useState(post.dislikes.some(userId => userId == 1));

    const showMoreHandler = () => {
        if(descriptionRef.current && showMoreRef.current){
            descriptionRef.current.style.webkitLineClamp = 'unset';
            showMoreRef.current.style.display = 'none';
        }
    };

    function formateTime(date: string){
        moment.locale('ru');
        return moment(date).fromNow();
    }
    function likeHandler(){
        setLike(like => isLiked ? like-1 : like+1);
        setDislike(dislike => isDisliked ? dislike-1 : dislike);
        setIsLiked(isLiked => !isLiked);
        setIsDisliked(false);
    }
    function dislikeHandler(){
        setDislike(dislike => isDisliked ? dislike-1 : dislike+1);
        setLike(like => isLiked ? like-1 : like);
        setIsDisliked(isDisliked => !isDisliked);
        setIsLiked(false);
    }

    return (
        <section className={styles.post}>
            <header>
                <div className={styles.authorBlock}>
                    <A href="/profile/3540" className={styles.authorImageBlock}>
                        <Image width="45" height="45" className={styles.authorImage} src={post.user.profilePicture}/>
                    </A>
                    <div className={styles.nameBlock}>
                        <A href="/profile/3540">
                            <span>{post.user.name}</span>
                        </A>
                        <time>{formateTime(post.createdAt)}</time>
                    </div>
                </div>
                <MoreHorizIcon className={styles.postOptions}/>
            </header>
            <section>
                <div className={styles.descriptionBlock}>
                    <p ref={descriptionRef}>
                        {post.desc}
                    </p>
                    <div ref={showMoreRef} onClick={showMoreHandler} className={styles.more} data-active>
                        Читать дальше
                    </div>
                </div>
                <div className={styles.postMainContent}>
                    {
                        post.imgs.map((img, index) => {
                            return (
                                <div key={index} className={styles.postMainContentItem} data-image-item>
                                    <div className={styles.backdropBlock}>
                                        <FullscreenIcon className={styles.icon}/>
                                    </div>
                                    <Image className={styles.image} width="100" height="100" layout="responsive" src={img}/>
                                </div>
                            );
                        })
                    }
                </div>
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
                            {post.commentsCount}
                        </span>
                    </li>
                </ul>
            </footer>
        </section>
    );
};

export default memo(Post);