import { useQuery } from '@apollo/client';
import { FC } from 'react';
import getAuthUser from '../../../apollo/queries/getAuthUser';
import { IInterlocutor } from '../../../apollo/queries/getNewestInterlocutors';
import { IMessenge } from '../../../models/messenge';
import { IAuthUser } from '../../../models/user';

import styles from './interlocuter.module.scss';


interface IProps{
    interlocutor: IInterlocutor;
    lastMessenge: IMessenge;
    setInterlocutorRoom: Function;
    isActive: boolean;
}

const Interlocuter: FC<IProps> = ({interlocutor, lastMessenge, setInterlocutorRoom, isActive}) => {
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    
    return (
        <div className={styles.interlocutor + (isActive ? ' '+styles.active : '')} onClick={() => setInterlocutorRoom(interlocutor.id)}>
            <div className={styles.interlocutorAvatar}>
                <img className={styles.img} src={interlocutor.profilePicture ? interlocutor.profilePicture : '/imgs/default_user_logo.jpg'}/>
            </div>
            <div className={styles.contentBlock}>
                <div>
                    <p className={styles.name}>{interlocutor.name}</p>
                    <p className={styles.lastMessenge}>{
                        lastMessenge.authorId == authUser?.getAuthUser?.id ?
                        'Вы: ' + lastMessenge.text : lastMessenge.text
                    }</p>
                </div>
                <div className={styles.lastMessengeDate}>
                    <time>{new Date(+lastMessenge.createdAt).toLocaleDateString('ru')}</time>
                </div>
            </div>
        </div>
    );
};

export default Interlocuter;