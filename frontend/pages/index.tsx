import type { NextPage } from 'next';
import MainContainer from '../components/MainContainer/MainContainer';
import SharePost from '../components/SharePost/SharePost';
import HomeRightbar from '../components/HomeRightbar/HomeRightbar';

import styles from '../public/styles/home.module.scss';


const Home: NextPage = () => {
  return (
    <MainContainer title="Home">
      <section className={styles.homepage}>
        <section className={styles.news}>
          <SharePost/>
        </section>
        <HomeRightbar/>
      </section>
    </MainContainer>
  );
}

export default Home;
