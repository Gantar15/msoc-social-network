import { FC } from 'react';
import { IInterlocutor } from '../../../apollo/queries/getNewestInterlocutors';
import { IMessenge } from '../../../models/messenge';

import styles from './interlocuter.module.scss';


interface IProps{
    interlocutor: IInterlocutor;
    lastMessenge: IMessenge;
}

const Interlocuter: FC<IProps> = ({interlocutor, lastMessenge}) => {
    return (
        <div className={styles.interlocutor}>
            <div className={styles.interlocutorAvatar}>
                <img className={styles.img} src={interlocutor.profilePicture ?? '/imgs/default_user_logo.jpg'}/>
            </div>
            <div className={styles.contentBlock}>
                <div>
                    <p className={styles.name}>{interlocutor.name}</p>
                    <p className={styles.lastMessenge}>{lastMessenge.text}</p>
                </div>
                <div className={styles.lastMessengeDate}>
                    <time>{new Date(lastMessenge.createdAt).toLocaleDateString('ru')}</time>
                </div>
            </div>
        </div>
    );
};

export default Interlocuter;