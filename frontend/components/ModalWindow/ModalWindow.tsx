import {FC, memo, useEffect} from 'react';

import styles from './modalWindow.module.scss';


interface IProps{
    isShow: boolean;
    setIsShow: Function;
    children: any;
}

const ModalWindow: FC<IProps> = ({children, isShow, setIsShow}) => {
    useEffect(() => {
        const escHandler = (ev: KeyboardEvent) => {
            if(ev.key != 'Escape') return;
            setIsShow(false);
        };
        window.addEventListener('keydown', escHandler);

        return () => {
            window.removeEventListener('keydown', escHandler);
        };
    }, []);

    return (
        <section className={styles.modalWindow + (!isShow ? ' '+styles.hidden : '')}>
            <div>
                <div className={styles.window}>
                    {children}
                </div>
            </div>
        </section>
    );
};
export default memo(ModalWindow);