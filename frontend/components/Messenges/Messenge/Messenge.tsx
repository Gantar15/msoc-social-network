import React, {FC, memo} from 'react'
import { IMessenge } from '../../../models/messenge';
import getAuthUser from '../../../apollo/queries/getAuthUser';
import type { IAuthUser } from "../../../models/user";
import { useQuery } from '@apollo/client';
import PreloadVideo from '../../PreloadVideo/PreloadVideo';
import ImageElement from '../../ImageElement/ImageElement';
import AudioElement from '../../AudioElement/AudioElement';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FileElement from '../../FileElement/FileElement';
import type {IMessengeExt} from '../RoomPage/RoomPage';

import styles from './messenge.module.scss';


interface IProps {
    messenge: IMessenge;
    setActiveMessenges: Function;
    activeMessenges: IMessengeExt[];
}

const Messenge: FC<IProps> = ({messenge, setActiveMessenges, activeMessenges}) => {
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    const isOurs = authUser?.getAuthUser.id == messenge.authorId;
    
    function isActive(){
        return activeMessenges.some(mess => mess.id == messenge.id);
    }
    function isExistMediaContent(){
        return messenge.imgs.length + messenge.videos.length + messenge.audios.length + messenge.documents.length != 0;
    }
    function activeHandler(){
        if(isActive())
            setActiveMessenges((oldMessenges: any) => oldMessenges.filter((oldMessenge: any) => oldMessenge.id != messenge.id));
        else
            setActiveMessenges((oldMessenges: any) => [...oldMessenges, {...messenge, isOurs}]);
    }

    return (
        <section onClick={activeHandler} className={styles.messenge + (isOurs ? ' ' + styles.ours : ' ' + styles.theirs) + (isActive() ? ' '+styles.active : '')}>
            <CheckCircleIcon className={styles.activeMessengeIcon}/>
            <div className={styles.content + (isExistMediaContent() ? ' ' + styles.existMediaContent : '')}>
                <div className={styles.messengeContent}>
                    {   messenge.text ? 
                        <p className={styles.messengeText}>
                            {
                                messenge.text
                            }
                        </p>
                        : null
                    }
                    {
                        isExistMediaContent() ?
                        (<div className={styles.messengeMediaContent}>
                            <div className={styles.graphicContent}>
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
                            </div>
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
                                                <FileElement isOurs={isOurs} filename={file.filename} src={file.codedFilename} key={index}/>
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
            </div>
        </section>
    )
};

export default memo(Messenge);