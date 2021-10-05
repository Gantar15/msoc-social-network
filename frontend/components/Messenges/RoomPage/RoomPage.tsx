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
import useApollo from '../../../apollo/client';

import styles from './roomPage.module.scss';


interface IProps{
    interlocutorRoom: number | undefined;
}

const RoomPage: FC<IProps> = ({interlocutorRoom}) => {
    const [getMessengesExecute, {data: messenges}] = useLazyQuery<getMessenges_Query>(getMessenges, {fetchPolicy: 'network-only'});
    const {data: newMessenge} = useSubscription<watchMessenge_Subscription>(watchMessenge, {
      variables: {
        recipientId: interlocutorRoom
      }
    });
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    const [getUserQuery, {data: authUserData}] = useLazyQuery<getUser_Query>(getUser);
    const [getInterlocutorData, {data: interlocutorData}] = useLazyQuery<getUser_Query>(getUser);
    const messengesBlockRef = useRef<HTMLDivElement | null>(null);
    const apolloClient = useApollo();
    
    useEffect(() => {
        if(authUser?.getAuthUser)
            getUserQuery({
                variables: {
                    userId: authUser.getAuthUser.id
                }
            });
    }, [authUser]);

    useEffect(() => {
        if(interlocutorRoom){
            getMessengesExecute({
                variables: {
                    recipientId: interlocutorRoom
                }
            });

            getInterlocutorData({
                variables: {
                    userId: interlocutorRoom
                }
            });
        }
    }, [interlocutorRoom]);

    useEffect(() => {
        if(newMessenge?.watchMessenge)
            apolloClient.refetchQueries({include: [getMessenges]});
    }, [newMessenge]);
    
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
                        messenges?.getMessenges ? messenges.getMessenges.map(messenge => (
                            <Messenge key={messenge.id} messenge={messenge}/>
                        ))
                        : 'Загрузка...'
                    }
                </div>
            </section>
            <MessengeSender interlocutorRoom={interlocutorRoom}/>
        </section>
    );
};
export default memo(RoomPage);