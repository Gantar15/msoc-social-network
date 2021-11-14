import { FC } from 'react';
import { IInterlocutor } from '../../../apollo/queries/getNewestInterlocutors';
import useAuthUser from '../../../hooks/useAuthUser';
import { IMessenge } from '../../../models/messenge';

import styles from './interlocuter.module.scss';


interface IProps{
    interlocutor: IInterlocutor;
    lastMessenge: IMessenge;
    setInterlocutorRoom: Function;
    isActive: boolean;
}

const Interlocuter: FC<IProps> = ({interlocutor, lastMessenge, setInterlocutorRoom, isActive}) => {
    const {authUser} = useAuthUser();
    let lastMessengeContent: string = '';
    if(lastMessenge.text){
        lastMessengeContent = lastMessenge.text;
    }
    else if(lastMessenge.imgs){
        lastMessengeContent = "Фото";
    }
    else if(lastMessenge.videos){
        lastMessengeContent = "Видео";
    }
    else if(lastMessenge.audios){
        lastMessengeContent = "Аудиозапись";
    }
    else if(lastMessenge.documents){
        lastMessengeContent = "Файл";
    }
    
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
                        'Вы: ' + lastMessengeContent : lastMessengeContent
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