import React, {FC, memo} from 'react'
import { IMessenge } from '../../../models/messenge';
import getAuthUser from '../../../apollo/queries/getAuthUser';
import type { IAuthUser } from "../../../models/user";
import { useQuery } from '@apollo/client';
import PreloadVideo from '../../PreloadVideo/PreloadVideo';
import ImageElement from '../../ImageElement/ImageElement';
import AudioElement from '../../AudioElement/AudioElement';

import styles from './messenge.module.scss';
import FileElement from '../../FileElement/FileElement';


interface IProps {
    messenge: IMessenge;
}

const Messenge: FC<IProps> = ({messenge}) => {
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    const isOurs = authUser?.getAuthUser.id == messenge.authorId;
    
    function isExistMediaContent(){
        return messenge.imgs.length + messenge.videos.length + messenge.audios.length + messenge.documents.length != 0;
    }

    return (
        <section className={styles.messenge + (isOurs ? ' ' + styles.ours : ' ' + styles.theirs)  + (isExistMediaContent() ? ' ' + styles.existMediaContent : '')}>
            <div className={styles.messengeContent}>
                <p className={styles.messengeText}>
                    {
                        messenge.text
                    }
                </p>
                {
                    isExistMediaContent() ?
                    (<div className={styles.messengeMediaContent}>
                        {
                            messenge.imgs.map((img, index) => {
                                return (
                                    <ImageElement key={index} src={img}/>
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
                        {   messenge.audios.length + messenge.documents.length ?
                            <div className={styles.messengeFileContent}>
                                {
                                    messenge.audios.map((audio, index) => {
                                        return (
                                            <AudioElement key={index} src={audio}/>
                                        );
                                    })
                                }
                                {
                                    messenge.documents.map((file, index) => {
                                        return (
                                            <FileElement isOurs={isOurs} src={file} key={index}/>
                                        );
                                    })
                                }
                            </div> 
                            : null
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