import { NextPage } from 'next';
import Image from 'next/image';

import styles from '../public/styles/page404.module.scss';


const Page404: NextPage = () => {
    return (
        <section className={styles.page404}>
            <img className={styles.image} src={'/imgs/not-found.png'} width={150} height={150}></img>
            <div>
                <h1>Ошибка 404</h1>
                <p>Страница не найдена. Скорее всего вы указали неверный путь. Попробуйте другой</p>
                <a href="/">На главную</a>
            </div>
        </section>
    );
};
export default Page404;