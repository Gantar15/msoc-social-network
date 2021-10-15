import React, {FC, memo} from 'react'
import { IMessenge } from '../../../models/messenge';
import getAuthUser from '../../../apollo/queries/getAuthUser';
import type { IAuthUser } from "../../../models/user";
import { useQuery } from '@apollo/client';
import PreloadVideo from '../../PreloadVideo/PreloadVideo';
import Image from 'next/image';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

import styles from './messenge.module.scss';


interface IProps {
    messenge: IMessenge;
}

const Messenge: FC<IProps> = ({messenge}) => {
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    const isOurs = authUser?.getAuthUser.id == messenge.authorId;
    
    return (
        <section className={styles.messenge + (isOurs ? ' ' + styles.ours : ' ' + styles.theirs)}>
            <div className={styles.messengeContent}>
                <p className={styles.messengeText}>
                    {
                        messenge.text
                    }
                </p>
                {
                    messenge.imgs.length + messenge.videos.length + messenge.audios.length != 0 ?
                    (<div className={styles.postMainContent}>
                        {
                            messenge.imgs.map((img, index) => {
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
                        {
                            messenge.videos.map((video, index) => {
                                return (
                                    <PreloadVideo key={index} src={video}/>
                                );
                            })
                        }
                        {
                            messenge.audios.map((audio, index) => {
                                return (
                                    <audio style={{width: '100%'}} src={audio} key={index} controls></audio>
                                );
                            })
                        }
                    </div>)
                   : null 
                }
            </div>
            <span className={styles.messengeDate}>
                {
                    new Date(+messenge.createdAt).toLocaleString('ru', {
                        hour: '2-digit', minute: '2-digit'
                    })
                }
            </span>
        </section>
    )
};

export default memo(Messenge);