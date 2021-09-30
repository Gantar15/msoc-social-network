import { FC, memo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import watchMessenge, {watchMessenge_Subscription} from '../../../apollo/subsciptions/watchMessenge';
import { useSubscription } from '@apollo/client';

import styles from './roomPage.module.scss';


interface IProps{
    interlocutorRoom: number | undefined;
}

const RoomPage: FC<IProps> = ({interlocutorRoom}) => {
    const {data: messenge, loading: messengeLoading} = useSubscription<watchMessenge_Subscription>(watchMessenge, {variables: {
        recipientId: 1
      }});

    if(!interlocutorRoom)
        return (
            <div className={styles.roomPage}>
                <h2 className={styles.noInterlocutorTitle}>Здесь будут отображены сообщения</h2>
                <p className={styles.noInterlocutorMessage}>Выберите собеседника</p>
            </div>
        );

    return (
        <section className={styles.roomPage}>
            {interlocutorRoom}
        </section>
    );
};
export default memo(RoomPage);