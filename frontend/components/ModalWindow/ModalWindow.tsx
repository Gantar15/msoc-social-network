import {FC, memo, useEffect} from 'react';

import styles from './modalWindow.module.scss';


interface IProps{
    isHidden: boolean;
    setIsHidden: Function;
    children: any;
}

const ModalWindow: FC<IProps> = ({children, isHidden, setIsHidden}) => {
    useEffect(() => {
        const escHandler = (ev: KeyboardEvent) => {
            if(ev.key != 'Escape') return;
            setIsHidden(true);
        };
        window.addEventListener('keydown', escHandler);

        return () => {
            window.removeEventListener('keydown', escHandler);
        };
    }, []);

    return (
        <section className={styles.modalWindow + (isHidden ? ' '+styles.hidden : '')}>
            <div>
                <div className={styles.window}>
                    {children}
                </div>
            </div>
        </section>
    );
};
export default memo(ModalWindow);