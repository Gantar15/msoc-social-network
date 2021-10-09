import {FC, useState} from 'react';
import useSendMessenge from '../../../apollo/mutations/sendMessenge';
import { Telegram } from '@material-ui/icons';
import {MicTwoTone} from '@material-ui/icons';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import styles from './messengeSender.module.scss';


interface IProps{
    interlocutorRoom: number;
}

const MessengeSender: FC<IProps> = ({interlocutorRoom}) => {
    const [messengeText, setMessengeText] = useState<string>('');
    const {sendMessenge} = useSendMessenge(interlocutorRoom);

    const inputHandler = (ev: any) => setMessengeText(ev.target.value);
    const sendHandler = () => {
        sendMessenge(messengeText);
        setMessengeText('');
    };
    const enterHandler = (ev: any) => {
        if(ev.key != 'Enter') return;
        sendHandler();
    };

    return (
        <section className={styles.messengeSender}>
            <div>
                <AttachFileIcon className={styles.addFile}/>
                <input value={messengeText} onKeyDown={enterHandler} onInput={inputHandler} className={styles.messengeField} type="text" placeholder="Напишите че-нибудь..."/>
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