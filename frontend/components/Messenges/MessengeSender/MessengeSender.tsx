import {FC, useState} from 'react';
import useSendMessenge from '../../../apollo/mutations/sendMessenge';
import { Telegram } from '@material-ui/icons';
import {MicTwoTone} from '@material-ui/icons';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MediaMenu from '../MediaMenu/MediaMenu';

import styles from './messengeSender.module.scss';


interface IProps{
    interlocutorRoom: number;
}

const MessengeSender: FC<IProps> = ({interlocutorRoom}) => {
    const [messengeText, setMessengeText] = useState<string>('');
    const [videos, setVideos] = useState<FileList|null>(null);
    const [imgs, setImgs] = useState<FileList|null>(null);
    const [documents, setDocuments] = useState<FileList|null>(null);
    const [audios, setAudios] = useState<FileList|null>(null);
    const [isShowMediaMenu, setIsShowMediaMenu] = useState(false);
    const {sendMessenge} = useSendMessenge(interlocutorRoom);

    const inputHandler = (ev: any) => setMessengeText(ev.target.value);
    const sendHandler = () => {
        sendMessenge(messengeText, imgs, videos, documents, audios);
        setMessengeText('');
        setVideos(null);
        setImgs(null);
        setDocuments(null);
        setAudios(null);
    };
    const enterHandler = (ev: any) => {
        if(ev.key != 'Enter') return;
        sendHandler();
    };

    return (
        <section className={styles.messengeSender}>
            <div>
                <div className={styles.addFileBlock}>
                    <AttachFileIcon onClick={() => setIsShowMediaMenu(currentVal => !currentVal)} className={styles.addFile}/>
                    {
                        isShowMediaMenu ? 
                        <MediaMenu 
                            setIsShowMediaMenu={setIsShowMediaMenu} 
                            setVideos={setVideos} 
                            setImgs={setImgs} 
                            setDocuments={setDocuments} 
                            setAudios={setAudios}
                        /> 
                        : null
                    }
                </div>
                <input value={messengeText} 
                    onKeyDown={enterHandler} 
                    onInput={inputHandler} 
                    className={styles.messengeField} 
                    type="text" 
                    placeholder="Напишите че-нибудь..."
                />
                <section className={styles.rightMenu + 
                        (messengeText ? ' ' + styles.active : '')}>
                    <SentimentSatisfiedIcon className={styles.emoji}/>
                    <MicTwoTone className={styles.voiceMessenge}/>
                    <Telegram onClick={sendHandler} className={styles.send}/>
                </section>
            </div>
        </section>
    );
};
export default MessengeSender;