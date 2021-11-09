import { FC, memo, useEffect, useRef, Fragment, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useGetMessenges } from "../../../apollo/queries/getMessenges";
import Messenge from "../Messenge/Messenge";
import getAuthUser from '../../../apollo/queries/getAuthUser';
import type { IAuthUser } from "../../../models/user";
import getUser, { getUser_Query } from "../../../apollo/queries/getUser";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import A from '../../A/A';
import MessengeSender from "../MessengeSender/MessengeSender";
import { IMessenge } from "../../../models/messenge";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ClearIcon from '@material-ui/icons/Clear';
import useRemoveMessenge from "../../../apollo/mutations/removeMessenge";
import useWatchMessenge from "../../../apollo/subsciptions/watchMessenge";
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import LocalPhoneOutlinedIcon from '@material-ui/icons/LocalPhoneOutlined';

import styles from './roomPage.module.scss';


interface IProps{
    interlocutorRoom: number;
}
interface IMessengeExt extends IMessenge{
    isOurs: boolean;
}
export type {IMessengeExt};

const RoomPage: FC<IProps> = ({interlocutorRoom}) => {
    const [activeMessenges, setActiveMessenges] = useState<IMessengeExt[]>([]);
    const {getMessengesExecute, getMessengesData: messenges, getMessengesLoading} = useGetMessenges();
    useWatchMessenge();
    const {removeMessenge: removeMessengeExecute} = useRemoveMessenge(interlocutorRoom);
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    const [getUserQuery, {data: authUserData}] = useLazyQuery<getUser_Query>(getUser);
    const [getInterlocutorData, {data: interlocutorData, error: getInterlocuterError}] = useLazyQuery<getUser_Query>(getUser);
    const messengesBlockRef = useRef<HTMLDivElement | null>(null);
    
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
        if(messengesBlockRef?.current)
        setTimeout(() => {
            if(messengesBlockRef?.current)
                messengesBlockRef.current.scrollTo(0, messengesBlockRef.current.scrollHeight)
        }, 100);
    }, [interlocutorRoom, messenges])

    function clearActiveMessenges(){
        setActiveMessenges([]);
    }
    function deleteMessengesHandler(){
        if(!authUser) return;
        if(activeMessenges.every(mess => mess.authorId == authUser.getAuthUser.id))
            activeMessenges.forEach(mess => {
                removeMessengeExecute(mess.id, false);
            });
        else
            activeMessenges.forEach(mess => {
                removeMessengeExecute(mess.id, true);
            });

        clearActiveMessenges();
    }
        
    if(getInterlocuterError){
        return (
            <section className={styles.roomPage}>
                <div className={styles.notFoundInterlocutor}>
                    <img src={"/imgs/not-found.png"} className={styles.icon}/>
                    <p>Пользователь не найден</p>
                    <A href="/friends" className={styles.otherUser}>
                        <span>Поищите другого</span>
                    </A>
                </div>
            </section>
        );
    }
    return (
        <section className={styles.roomPage}>
            <header className={styles.roomPageHeader}>
                <div>
                    {
                        activeMessenges.length ? (
                            <div className={styles.activeMessengesPanel}>
                                <div className={styles.messengesCounter}>
                                    <p>Сообщений выбрано - {activeMessenges.length}</p>
                                    <ClearIcon onClick={clearActiveMessenges} className={styles.cancel}/>
                                </div>
                                <div className={styles.messengesActions}>
                                    {
                                        <DeleteOutlineIcon className={styles.actionIcon} onClick={deleteMessengesHandler}/>
                                    }
                                </div>
                            </div>
                        ) : (
                            <>
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
                                <div className={styles.userActions}>
                                    <LocalPhoneOutlinedIcon className={styles.userActionsElement + ' ' + styles.audioCall}/>
                                    <VideocamOutlinedIcon className={styles.userActionsElement + ' ' + styles.videoCall}/>
                                    <MoreHorizIcon className={styles.userActionsElement + ' ' + styles.roomSettings}/>
                                </div>
                            </>
                        )
                    }
                </div>
            </header>
            <section ref={messengesBlockRef} className={styles.messengesBlock}>
                <div>
                    {
                        !messenges?.getMessenges.length && !getMessengesLoading ? (
                            <section className={styles.noMessenges}>
                                <div>
                                    <A href={`/profile/${interlocutorRoom}`}>
                                        <img className={styles.img} src={interlocutorData?.getUser.profilePicture ? interlocutorData?.getUser.profilePicture : '/imgs/default_user_logo.jpg'} width="50" height="50"/>
                                    </A>
                                    <p>
                                        Вы пока что не общались с <b>{interlocutorData?.getUser.name}</b><br/>
                                        Напишите что-нибудь
                                    </p>
                                </div>
                            </section>
                        ) : null
                    }
                    {
                        messenges?.getMessenges ? messenges.getMessenges.map((messenge, index) => {
                            let dateEl: any = null;
                            if(index == 0 || index-1 >= 0 && new Date(+messenge.createdAt).getDate() > new Date(+messenges.getMessenges[index-1].createdAt).getDate())
                                dateEl = <p className={styles.dateMark}>{new Date(+messenge.createdAt).toLocaleString('ru', {month: 'long', day: '2-digit'})}</p>;
                            
                            return (
                                <Fragment key={messenge.id}>
                                    {dateEl}
                                    <Messenge setActiveMessenges={setActiveMessenges} activeMessenges={activeMessenges} messenge={messenge}/>
                                </Fragment>
                            );
                        })
                        : null
                    }
                    {
                        getMessengesLoading ? <img src="/imgs/loading.gif" className={styles.loading} width="30" height="30"/> : null
                    }
                </div>
            </section>
            {interlocutorRoom ? <MessengeSender interlocutorRoom={interlocutorRoom}/> : null}
        </section>
    );
};
export default memo(RoomPage);