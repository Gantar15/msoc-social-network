import {FC} from 'react';

import styles from './messengeSender.module.scss';


const MessengeSender: FC = () => {
    return (
        <section className={styles.messengeSender}>
            <div>
                <input className={styles.messengeField} type="text" placeholder="Напишите че-нибудь"/>
            </div>
        </section>
    );
};
export default MessengeSender;