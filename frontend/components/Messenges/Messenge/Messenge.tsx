import React, {FC, memo} from 'react'
import { IMessenge } from '../../../models/messenge';
import PreloadVideo from '../../PreloadVideo/PreloadVideo';
import ImageElement from '../../ImageElement/ImageElement';
import AudioElement from '../../AudioElement/AudioElement';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FileElement from '../../FileElement/FileElement';
import type {IMessengeExt} from '../RoomPage/RoomPage';
import EditOutlined from '@material-ui/icons/EditOutlined';
import useAuthUser from '../../../hooks/useAuthUser';

import styles from './messenge.module.scss';


interface IProps {
    messenge: IMessenge;
    setActiveMessenges: Function;
    activeMessenges: IMessengeExt[];
}

const Messenge: FC<IProps> = ({messenge, setActiveMessenges, activeMessenges}) => {
    const {authUser} = useAuthUser();
    const isOurs = authUser?.getAuthUser?.id === messenge.authorId;
    
    function isActive(){
        return activeMessenges.some(mess => mess.id === messenge.id);
    }
    
    function isExistMediaContent(){
        return messenge.imgs.length + messenge.videos.length + messenge.audios.length + messenge.documents.length != 0;
    }
    function activeHandler(ev: any){
        const allowedClasses = [styles.messenge, styles.content, styles.messengeText, styles.contentBlock, styles.messengeDate];
        if(allowedClasses.every(className => !ev.target.classList.contains(className)) && !ev.target.closest('.'+styles.activeMessengeIcon)) return;

        if(isActive())
            setActiveMessenges((oldMessenges: any) => oldMessenges.filter((oldMessenge: any) => oldMessenge.id != messenge.id));
        else
            setActiveMessenges((oldMessenges: any) => [...oldMessenges, {...messenge, isOurs}]);
    }
    function editHandler(){
        
    }

    return (
        <section onClick={activeHandler} className={styles.messenge + (isOurs ? ' ' + styles.ours : ' ' + styles.theirs) + (isActive() ? ' '+styles.active : '')}>
            <div className={styles.messengeActions}>
                {
                    isOurs ? <EditOutlined className={styles.actionIcon} onClick={editHandler}/> : false
                }
            </div>
            <div className={styles.contentBlock}>
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
            </div>
        </section>
    )
};

export default memo(Messenge);