import { FC, memo, useEffect } from "react";
import { useLazyQuery, useQuery, useMutation, useSubscription } from "@apollo/client";
import watchMessenge, {watchMessenge_Subscription} from '../../../apollo/subsciptions/watchMessenge';
import getMessenges, {getMessenges_Query} from "../../../apollo/queries/getMessenges";
import Messenge from "../Messenge/Messenge";

import styles from './roomPage.module.scss';


interface IProps{
    interlocutorRoom: number | undefined;
}

const RoomPage: FC<IProps> = ({interlocutorRoom}) => {
    const [getMessengesExecute, {data: messenges, loading: messengesLoading}] = useLazyQuery<getMessenges_Query>(getMessenges, {fetchPolicy: 'network-only'});
    const {data: newMessenge, loading: newMessengeLoading} = useSubscription<watchMessenge_Subscription>(watchMessenge, {
      variables: {
        recipientId: interlocutorRoom
      },
      shouldResubscribe: true
    });
    
    useEffect(() => {
        if(interlocutorRoom)
            getMessengesExecute({
                variables: {
                    recipientId: interlocutorRoom
                }
            });
    }, [interlocutorRoom])
    
    if(!interlocutorRoom)
        return (
            <div className={styles.roomPage + ' ' + styles.noInterlocutor}>
                <img className={styles.messImgs} src="/imgs/comments.svg"/>
                <h2 className={styles.noInterlocutorTitle}>Здесь будут отображены сообщения</h2>
                <p className={styles.noInterlocutorMessage}>Выберите собеседника</p>
            </div>
        );
        
    return (
        <section className={styles.roomPage}>
            <section className={styles.messengesBlock}>
                <div>
                    {
                        messenges?.getMessenges.map(messenge => (
                            <Messenge key={messenge.id} messenge={messenge}/>
                        ))
                    }
                </div>
            </section>
        </section>
    );
};
export default memo(RoomPage);