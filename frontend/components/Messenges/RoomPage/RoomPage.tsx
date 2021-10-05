import { FC, memo, useEffect, useRef } from "react";
import { useLazyQuery, useQuery, useMutation, useSubscription } from "@apollo/client";
import watchMessenge, {watchMessenge_Subscription} from '../../../apollo/subsciptions/watchMessenge';
import getMessenges, {getMessenges_Query} from "../../../apollo/queries/getMessenges";
import Messenge from "../Messenge/Messenge";
import getAuthUser from '../../../apollo/queries/getAuthUser';
import type { IAuthUser } from "../../../models/user";
import getUser, { getUser_Query } from "../../../apollo/queries/getUser";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import A from '../../A/A';
import MessengeSender from "../MessengeSender/MessengeSender";

import styles from './roomPage.module.scss';


interface IProps{
    interlocutorRoom: number | undefined;
}

const RoomPage: FC<IProps> = ({interlocutorRoom}) => {
    const [getMessengesExecute, {data: messenges, loading: messengesLoading}] = useLazyQuery<getMessenges_Query>(getMessenges, {fetchPolicy: 'network-only'});
    const {data: newMessenge, loading: newMessengeLoading} = useSubscription<watchMessenge_Subscription>(watchMessenge, {
      variables: {
        recipientId: interlocutorRoom
      }
    });
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    const [getUserQuery, {data: authUserData}] = useLazyQuery<getUser_Query>(getUser);
    const {data: interlocutorData} = useQuery<getUser_Query>(getUser, {
        variables: {
            userId: interlocutorRoom
        }
    });
    const messengesBlockRef = useRef<HTMLDivElement | null>(null);
console.log(newMessenge?.watchMessenge)
    useEffect(() => {
        if(authUser?.getAuthUser)
            getUserQuery({
                variables: {
                    userId: authUser.getAuthUser.id
                }
            });
    }, [authUser]);
    
    useEffect(() => {
        if(interlocutorRoom)
            getMessengesExecute({
                variables: {
                    recipientId: interlocutorRoom
                }
            });
    }, [interlocutorRoom]);
    
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
            <header className={styles.roomPageHeader}>
                <div>
                    <div className={styles.profileBlock}>
                        <A href={`/profile/${interlocutorRoom}`} className={styles.profilePicture}>
                            <img src={authUserData?.getUser.profilePicture ? authUserData?.getUser.profilePicture : '/imgs/default_user_logo.jpg'}/>
                        </A>
                        <div className={styles.nameBlock}>
                            <A href={`/profile/${interlocutorRoom}`} className={styles.name}>
                                <span>
                                    {
                                        interlocutorData?.getUser.name
                                    }
                                </span>
                            </A>
                            <span className={styles.networkStatus}>
                                В сети 35 мин. назад
                            </span>
                        </div>
                    </div>
                    <MoreHorizIcon className={styles.roomSettings}/>
                </div>
            </header>
            <section className={styles.messengesBlock}>
                <div ref={messengesBlockRef}>
                    {
                        messenges?.getMessenges && messenges.getMessenges.map(messenge => (
                            <Messenge key={messenge.id} messenge={messenge}/>
                        ))
                    }
                    {
                        newMessenge?.watchMessenge ?
                            <Messenge key={newMessenge.watchMessenge.id} messenge={newMessenge.watchMessenge}/>
                            : null
                    }
                </div>
            </section>
            <MessengeSender interlocutorRoom={interlocutorRoom}/>
        </section>
    );
};
export default memo(RoomPage);