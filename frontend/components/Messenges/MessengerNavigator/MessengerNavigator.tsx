import {FC, memo} from 'react';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import Search from '@material-ui/icons/Search';
import Interlocuter from '../Interlocutor/Interlocuter';
import { useQuery } from '@apollo/client';
import getNewestInterlocutors, { getNewestInterlocutors_Query } from '../../../apollo/queries/getNewestInterlocutors';
import getNewestMessenges, { getNewestMessenges_Query } from '../../../apollo/queries/getNewestMessenges';

import styles from "./MessengerNavigator.module.scss";


interface IProps{
    setInterlocutorRoom: Function;
    interlocutorRoom?: number;
}

const MessengerNavigator: FC<IProps> = ({setInterlocutorRoom, interlocutorRoom}) => {
    const {data: newestInterlocutors, loading: newestInterlocutorsLoading} = useQuery<getNewestInterlocutors_Query>(getNewestInterlocutors);
    const {data: newestMessenges, loading: newestMessengesLoading} = useQuery<getNewestMessenges_Query>(getNewestMessenges);

    if(newestInterlocutorsLoading || newestMessengesLoading)
        return (
            <section className={styles.messengerNavigator}>
                <div>
                    Загрузка...
                </div>
            </section>
        );
    else
        return (
            <section className={styles.messengerNavigator}>
                <header>
                    <div className={styles.search}>
                        <Search className={styles.searchIcon}/>
                        <input type="text" placeholder="Поиск"/>
                    </div>
                    <SettingsOutlinedIcon className={styles.settings}/>
                </header>
                <section className={styles.interlocutorsBlock}>
                    {
                        newestInterlocutors?.getNewestInterlocutors.length ?
                        newestInterlocutors.getNewestInterlocutors.map(interlocutor => {
                            const lastMessenge = newestMessenges?.getNewestMessenges.find(mess => mess.recipientId == interlocutor.id || mess.authorId == interlocutor.id);

                            if(lastMessenge)
                                return (
                                    <Interlocuter 
                                        isActive={!!(interlocutorRoom && interlocutorRoom == interlocutor.id)} 
                                        setInterlocutorRoom={setInterlocutorRoom} 
                                        key={lastMessenge.id} 
                                        interlocutor={interlocutor}
                                        lastMessenge={lastMessenge}
                                    />
                                );
                        })
                        : 
                        newestInterlocutorsLoading ? <p>...</p>
                        : (
                            <p className={styles.noInnterlocutorsText}>
                                Собеседников нет
                            </p>
                        )
                    }
                </section>
                <footer>
                    <p>Это все беседы</p>
                </footer>
            </section>
        );
};
export default memo(MessengerNavigator);