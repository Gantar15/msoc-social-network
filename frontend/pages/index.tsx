import type { NextPage } from 'next';
import Topbar from '../components/Topbar/Topbar';
import MainContainer from '../components/MainContainer/MainContainer';


const Home: NextPage = () => {
  return (
    <MainContainer title="Home">
      <Topbar/>
    </MainContainer>
  );
}

export default Home;
