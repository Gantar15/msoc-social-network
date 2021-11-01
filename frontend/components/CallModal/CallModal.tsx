import { useQuery } from '@apollo/client';
import { FC, memo } from 'react';
import getAuthUser from '../../apollo/queries/getAuthUser';
import useWebRTC from '../../hooks/useWebRTC';
import { IAuthUser } from '../../models/user';

import styles from './callModal.module.scss';


interface IProps{
    roomId: number;
}

const CallModal: FC<IProps> = ({roomId}) => {
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    const [clients, provideMediaRef] = useWebRTC(roomId, authUser!.getAuthUser.id);
    
    return (
        <section className={styles.callModal}>
            {
                clients.map((clientId: number) => {
                    return (
                        <div key = {clientId}>
                            <video
                                ref = {instance => provideMediaRef(clientId, instance)}
                                autoPlay
                                playsInline style={{transform: 'rotateY(180deg)'}}/>
                        </div>
                    );
                })
            }
        </section>
    );
};
export default memo(CallModal);