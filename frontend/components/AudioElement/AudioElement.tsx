import {FC} from 'react';

import styles from './audioElement.module.scss';


interface IProps{
    src: string;
}

const AudioElement: FC<IProps> = ({src}) => {
    return (
        <section className={styles.audioElement}>
            <audio src={src} controls></audio>
        </section>
    );
};
export default AudioElement;