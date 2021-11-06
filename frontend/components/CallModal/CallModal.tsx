import { useQuery } from '@apollo/client';
import { FC, memo, useState } from 'react';
import getAuthUser from '../../apollo/queries/getAuthUser';
import useWebRTC from '../../hooks/useWebRTC';
import { IAuthUser } from '../../models/user';
import ModalWindow from '../ModalWindow/ModalWindow';

import styles from './callModal.module.scss';


interface IProps{
    roomId: number;
}

const CallModal: FC<IProps> = ({roomId}) => {
    const [isHidden, setIsHidden] = useState(false);
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    const [clients, provideMediaRef] = useWebRTC(roomId, authUser!.getAuthUser.id);

    return (
        <ModalWindow isHidden={isHidden} setIsHidden={setIsHidden}>
            <section className={styles.callModal}>
                {
                    clients.map((clientId: number) => {
                        return (
                            <div key={clientId} className={styles.peerVideoBlock}>
                                <video
                                    ref = {instance => provideMediaRef(clientId, instance)}
                                    autoPlay
                                    playsInline style={{transform: 'rotateY(180deg)'}}/>
                            </div>
                        );
                    })
                }
            </section>
        </ModalWindow>
    );
};
export default memo(CallModal);