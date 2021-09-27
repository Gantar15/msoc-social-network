import {FC} from 'react';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import Search from '@material-ui/icons/Search';
import Interlocuter from '../Interlocutor/Interlocuter';
import { useQuery } from '@apollo/client';
import getNewestInterlocutors, { getNewestInterlocutors_Query } from '../../../apollo/queries/getNewestInterlocutors';
import getNewestMessenges, { getNewestMessenges_Query } from '../../../apollo/queries/getNewestMessenges';

import styles from "./MessengerNavigator.module.scss";


const MessengerNavigator: FC = () => {
    const {data: newestInterlocutors, loading: newestInterlocutorsLoading} = useQuery<getNewestInterlocutors_Query>(getNewestInterlocutors);
    const {data: newestMessenges, loading: newestMessengesLoading} = useQuery<getNewestMessenges_Query>(getNewestMessenges);

    if(newestInterlocutorsLoading || newestMessengesLoading)
        return (
            <section className={styles.MessengerNavigator}>
                Загрузка...
            </section>
        );
    else
        return (
            <section className={styles.MessengerNavigator}>
                <header>
                    <div className={styles.search}>
                        <Search className={styles.searchIcon}/>
                        <input type="text" placeholder="Поиск"/>
                    </div>
                    <SettingsOutlinedIcon className={styles.settings}/>
                </header>
                <section className={styles.interlocutorBlock}>
                    {
                        newestInterlocutors?.getNewestInterlocutors.map(interlocutor => {
                            const lastMessenge = newestMessenges?.getNewestMessenges.find(mess => mess.recipientId == interlocutor.id);

                            if(lastMessenge)
                                return (
                                    <Interlocuter interlocutor={interlocutor} lastMessenge={lastMessenge}/>
                                );
                        })
                    }
                </section>
            </section>
        );
};
export default MessengerNavigator;