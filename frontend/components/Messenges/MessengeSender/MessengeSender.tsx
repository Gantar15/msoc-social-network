import { useMutation } from '@apollo/client';
import {FC, useState} from 'react';
import useSendMessenge from '../../../apollo/mutations/sendMessenge';

import styles from './messengeSender.module.scss';


interface IProps{
    interlocutorRoom: number;
}

const MessengeSender: FC<IProps> = ({interlocutorRoom}) => {
    const [messengeText, setMessengeText] = useState<string>('');
    const {sendMessenge} = useSendMessenge(interlocutorRoom);

    const inputHandler = (ev: any) => setMessengeText(ev.target.value);
    const enterHandler = (ev: any) => {
        if(ev.key != 'Enter') return;

        sendMessenge(messengeText);
        setMessengeText('');
    };

    return (
        <section className={styles.messengeSender}>
            <div>
                <input  value={messengeText} onKeyDown={enterHandler} onInput={inputHandler} className={styles.messengeField} type="text" placeholder="Напишите че-нибудь"/>
            </div>
        </section>
    );
};
export default MessengeSender;