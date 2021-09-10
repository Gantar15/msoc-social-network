
import {FC, useEffect, useState} from 'react';
import {useRef, memo} from 'react';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

import styles from './preloadVideo.module.scss';


interface IProps{
    src: string;
}

const PreloadVideo: FC<IProps> = ({src}) => {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const loadeddataHandler = function(this: any) {
        this.currentTime = 1;
    }
    const seekendHandler = function(this: any) {
        if(canvasRef.current){
            canvasRef.current.width = 1920;
            canvasRef.current.height = 1080;
            const context = canvasRef.current!.getContext('2d');
            context!.drawImage(videoRef.current!, 0, 0, 1920, 1080);
            const dataURL = canvasRef.current!.toDataURL('image/png');
        
            imageRef.current!.setAttribute('src', dataURL);
        }
    };
    useEffect(() => {
        if(videoRef.current){
            videoRef.current.addEventListener('loadeddata', loadeddataHandler);
            videoRef.current.addEventListener('seeked', seekendHandler);

            return () => {
                if(videoRef.current){
                    videoRef.current.removeEventListener('loadeddata', loadeddataHandler);
                    videoRef.current.removeEventListener('seeked', seekendHandler);
                }
            };
        }
    }, [videoRef.current]);

    return (
        <div className={styles.postMainContentItem} data-video-item>
            <div className={styles.backdropBlock}>
                <PlayCircleOutlineIcon className={styles.icon}/>
            </div>
            <video crossOrigin="anonymous" style={{display: 'none'}} src={src} ref={videoRef}></video>
            <canvas style={{display: 'none'}} ref={canvasRef}></canvas>
            <img ref={imageRef} style={{width: '100%', height: '100%'}} className={styles.image}/>
        </div>
    );
};

export default memo(PreloadVideo);