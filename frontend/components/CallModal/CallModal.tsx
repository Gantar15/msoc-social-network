import { FC, memo, useState } from 'react';
import useWebRTC from '../../hooks/useWebRTC';
import ModalWindow from '../ModalWindow/ModalWindow';
import MicOffOutlinedIcon from '@material-ui/icons/MicOffOutlined';
import VideocamOffOutlinedIcon from '@material-ui/icons/VideocamOffOutlined';
import MicNoneOutlinedIcon from '@material-ui/icons/MicNoneOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import useAuthUser from '../../hooks/useAuthUser';

import styles from './callModal.module.scss';


interface IProps{
    roomId: number;
    isShowCallModal: boolean;
    setIsShowCallModal: Function;
}

const CallModal: FC<IProps> = ({roomId, isShowCallModal, setIsShowCallModal}) => {
    const [isAudio, setIsAudio] = useState(true);
    const [isVideo, setIsVideo] = useState(true);
    const {authUser} = useAuthUser();
    const [clients, provideMediaRef] = useWebRTC(roomId, authUser?.getAuthUser?.id, isAudio, isVideo);

    if(!isShowCallModal) return null;
    return (
        <ModalWindow isShow={isShowCallModal} setIsShow={setIsShowCallModal}>
            <section className={styles.callModal}>
                <section className={styles.peersBlock}>
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
                <footer className={styles.commandPanel}>
                    <div className={styles.mainCommands}>
                        <div onClick={() => setIsAudio(current => !current)} className={styles.commandFunction + ' ' + styles.audioFunction}>
                            {
                                isAudio ? <MicOffOutlinedIcon className={styles.icon}/>
                                : <MicNoneOutlinedIcon className={styles.icon}/>
                            }
                        </div>
                        <div onClick={() => setIsVideo(current => !current)} className={styles.commandFunction + ' ' + styles.videoFunction}>
                            {
                                isVideo ? <VideocamOffOutlinedIcon className={styles.icon}/>
                                : <VideocamOutlinedIcon className={styles.icon}/>
                            }
                        </div>
                        <div onClick={() => setIsShowCallModal(false)} className={styles.commandFunction + ' ' + styles.leaveFunction}>
                            <ExitToAppOutlinedIcon className={styles.icon}/>
                        </div>
                    </div>
                </footer>
            </section>
        </ModalWindow>
    );
};
export default memo(CallModal);