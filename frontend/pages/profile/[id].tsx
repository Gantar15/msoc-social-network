import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import MainContainer from "../../components/MainContainer/MainContainer";
import ProfileHeader from "../../components/Profile/ProfileHeader/ProfileHeader";
import Post from '../../components/Post/Post';
import SubjectIcon from '@material-ui/icons/Subject';
import SharePost from '../../components/SharePost/SharePost';
import A from '../../components/A/A';
import ProfileUserRightbar from "../../components/Profile/ProfileUserRightbar/ProfileUserRightbar";
import type {IPost} from '../../models/post';
import validateRefreshToken from '../../utils/validateRefreshToken';

import styles from '../../public/styles/profile.module.scss';


const fakePosts: IPost[] = [
    {
      id: 1,
      user: {
        id: 1,
        name: 'Владилен Пестров',
        profilePicture: "/imgs/photo1.jpg"
      },
      createdAt: '2021-08-14 01:56:02.384+03',
      desc: 'Лишь тщательные исследования конкурентов, которые представляют собой яркий пример континентально-европейского типа политической культуры, будут в равной степени предоставлены сами себе. В целом, конечно, синтетическое тестирование позволяет оценить значение прогресса профессионального сообщества. Учитывая ключевые сценарии поведения, дальнейшее развитие различных форм деятельности напрямую зависит от форм воздействия. Безусловно, базовый вектор развития играет определяющее значение для соответствующих условий активизации. Современные технологии достигли такого уровня, что курс на социально-ориентированный национальный проект создаёт необходимость включения в производственный план целого ряда внеочередных мероприятий с учётом комплекса стандартных подходов. Идейные соображения высшего порядка, а также граница обучения кадров, в своём классическом представлении, допускает внедрение существующих финансовых и административных условий. Элементы политического процесса, превозмогая сложившуюся непростую экономическую ситуацию, призваны к ответу. Ясность нашей позиции очевидна: базовый вектор развития не оставляет шанса для новых принципов формирования материально-технической и кадровой базы. Идейные соображения высшего порядка, а также перспективное планирование способствует подготовке и реализации поэтапного и последовательного развития общества. Банальные, но неопровержимые выводы, а также стремящиеся вытеснить традиционное производство, нанотехнологии формируют глобальную экономическую сеть и при этом - разоблачены.',
      imgs: ['/imgs/post1.jpg', '/imgs/post1-2.jpg', '/imgs/post1-3.jpg'],
      likes: [1, 2, 3, 4, 5, 9, 111, 1366, 233, 523],
      dislikes: [11, 34, 67, 33],
      comments: [17],
      shareCount: 7
    },
  ];

const Profile: NextPage = () => {
    const router = useRouter();
    const userId = router.query.id;

    return (
        <MainContainer activePage={1} title="Profile">
            <main className={styles.profile}>
                <ProfileHeader userId={1}/>
                <section className={styles.mainContent}>
                    <section>
                        <SharePost/>
                        <div className={styles.postsBlock}>
                            <header className={styles.filters}>
                                <div className={styles.filter + ' ' + styles.active}>
                                    <span>Самые новые</span>
                                    <div></div>
                                </div>
                                <div className={styles.filter}>
                                    <span>Самые популярные</span>
                                    <div></div>
                                </div>
                                <div className={styles.postsCounter}>
                                    <SubjectIcon className={styles.icon}/>
                                    <span>76</span>
                                </div>
                            </header>
                            <div className={styles.posts}>
                                {fakePosts.map(post => {
                                    return (
                                        <Post key={post.id} post={post}/>
                                    )
                                })}
                            </div>
                        </div>
                    </section>

                    <section>
                        <ProfileUserRightbar title={'Подписчики'} count={657}/>

                        <ProfileUserRightbar title={'Подписки'} count={132}/>
                    </section>
                </section>
            </main>
        </MainContainer>
    );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async ({req}) => {
    const API_URL = 'http://localhost:7700';
    const result = await validateRefreshToken(API_URL+'/auth/refreshTokenValidate', req.cookies.refreshToken);
    if(!result){
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      };
    }
  
    return {
      props: {
      }
    };
};