import { FC, ReactElement } from "react";
import Head from 'next/head';
import Topbar from '../../components/Topbar/Topbar';
import Sidebar from '../../components/Sidebar/Sidebar';

import styles from './mainContainer.module.scss';


interface IProps{
    children: ReactElement | ReactElement[];
    title: string;
    activePage: number;
}

const MainContainer: FC<IProps> = ({children, title, activePage}) => {
    return (
        <>
            <Head>
                <meta name="keywords" content="social network, friends, society, relashionship"/>
                <meta name="author" content="Pavlovsky Egor"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta name="description" content="super social network"/>
                <link rel="shortcut icon" href="/imgs/main_logo.png" type="image/png"/>
                <meta charSet="utf-8"/>
                <title>{title}</title>
            </Head>
            <div className={styles.mainContainer}>
                <Sidebar activePage={activePage}/>
                <section className={styles.mainContentBlock}>
                    <Topbar/>
                    <section className={styles.pageContent}>
                        {children}
                    </section>
                </section>
            </div>
        </>
    );
};

export default MainContainer;