import {FC, memo, useEffect, useState} from 'react';
import CloudDownload from '@material-ui/icons/CloudDownload';

import styles from './fileElement.module.scss';


interface IProps{
    src: string;
    isOurs: boolean;
}

const AudioElement: FC<IProps> = ({src, isOurs}) => {
    const filename = src.split('/')[src.split('/').length-1];
    const [filesize, setFilesize] = useState('');

    useEffect(() => {
        fetch(src).then(resp => {
            if(!resp.headers.get('Content-Length')) return;

            const bytesize = +resp.headers.get('Content-Length')!;
            let finalSize = (bytesize/1048576).toFixed(2) + 'mb';
            if(parseInt(finalSize) < 1)
                finalSize = (bytesize/1024).toFixed(2) + 'kb';
            setFilesize(finalSize);
        });
    }, []);

    return (
        <section className={styles.fileElement + (isOurs ? ' ' + styles.ours : ' ' + styles.theirs)}>
            <a target='_blank' href={src}>
                <CloudDownload className={styles.icon}/>
            </a>
            <div className={styles.description}>
                <a target='_blank' href={src} className={styles.filename}>
                    {filename}
                </a>
                <p className={styles.filesize}>
                    {filesize}
                </p>
            </div>
        </section>
    );
};
export default memo(AudioElement);