import {FC} from 'react';
import Image from 'next/image';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

import styles from './imageElement.module.scss';


interface IProps{
    src: string;
}

const ImageElement: FC<IProps> = ({src}) => {
    return (
        <section className={styles.imageElement}>
            <div className={styles.backdropBlock}>
                <FullscreenIcon className={styles.icon}/>
            </div>
            <Image className={styles.image} width="100" height="100" layout="responsive" src={src}/>
        </section>
    );
};
export default ImageElement;