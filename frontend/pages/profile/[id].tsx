
import { NextPage } from "next";
import { useRouter } from 'next/router'
import Image from 'next/image';
import MainContainer from "../../components/MainContainer/MainContainer";
import ProfileHeader from "../../components/Profile/ProfileHeader/ProfileHeader";
import Post from '../../components/Post/Post';
import SharePost from '../../components/SharePost/SharePost';
import A from '../../components/A/A';
import SubjectIcon from '@material-ui/icons/Subject';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import styles from '../../public/styles/profile.module.scss';

const fakePosts: {
    id: number;
    user: {
      id: number;
      name: string;
      profilePicture: string;
    };
    desc: string;
    imgs: string[];
    likes: number[];
    dislikes: number[];
    commentsCount: number;
    createdAt: string;
    shareCount: number;
  }[] = [
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
      commentsCount: 17,
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
                        <div className={styles.subscribers}>
                            <header className={styles.titleBlock}>
                                <h2 className={styles.title}>Подписчики</h2>
                                <div className={styles.indicator}>
                                    <div>
                                        <span>121</span> 
                                        <PeopleAltIcon className={styles.icon}/>
                                    </div>
                                </div>
                            </header>
                            <section className={styles.users}>
                                <div className={styles.user}>
                                    <div className={styles.userInfo}>
                                        <A href="/profile/361">
                                            <div className={styles.avatar}>
                                                <Image className={styles.img} src="/imgs/photo1.jpg" width="10" height="10" layout="responsive"/>
                                                <div className={styles.networkStatus + ' ' + styles.online}></div>
                                            </div>
                                        </A>
                                        <A href="/profile/361">
                                            <span className={styles.name}>Григорий</span>
                                        </A>
                                    </div>
                                    <button className={styles.unsubscribe}>
                                        Отписаться
                                    </button>
                                </div>
                                <div className={styles.user}>
                                    <div className={styles.userInfo}>
                                        <A href="/profile/361">
                                            <div className={styles.avatar}>
                                                <Image className={styles.img} src="/imgs/post1-2.jpg" width="10" height="10" layout="responsive"/>
                                                <div className={styles.networkStatus + ' ' + styles.offline}></div>
                                            </div>
                                        </A>
                                        <A href="/profile/361">
                                            <span className={styles.name}>Инакентий Валерьевич</span>
                                        </A>
                                    </div>
                                    <button className={styles.subscribe}>
                                            Подписаться
                                    </button>
                                </div>
                            </section>
                            <div className={styles.more}>
                                <div>
                                    <span>Смотреть все</span>
                                    <KeyboardArrowRightIcon className={styles.icon}/>
                                </div>
                            </div>
                        </div>

                        <div className={styles.subscriptions}>
                            <header className={styles.titleBlock}>
                                <h2 className={styles.title}>Подписки</h2>
                                <div className={styles.indicator}>
                                    <div>
                                        <span>453</span> 
                                        <PeopleAltIcon className={styles.icon}/>
                                    </div>
                                </div>
                            </header>
                            <section className={styles.users}>
                                <div className={styles.user}>
                                    <div className={styles.userInfo}>
                                        <A href="/profile/361">
                                            <div className={styles.avatar}>
                                                <Image className={styles.img} src="/imgs/photo1.jpg" width="10" height="10" layout="responsive"/>
                                                <div className={styles.networkStatus + ' ' + styles.online}></div>
                                            </div>
                                        </A>
                                        <A href="/profile/361">
                                            <span className={styles.name}>Григорий</span>
                                        </A>
                                    </div>
                                    <button className={styles.unsubscribe}>
                                        Отписаться
                                    </button>
                                </div>
                                <div className={styles.user}>
                                    <div className={styles.userInfo}>
                                        <A href="/profile/361">
                                            <div className={styles.avatar}>
                                                <Image className={styles.img} src="/imgs/post1-2.jpg" width="10" height="10" layout="responsive"/>
                                                <div className={styles.networkStatus + ' ' + styles.offline}></div>
                                            </div>
                                        </A>
                                        <A href="/profile/361">
                                            <span className={styles.name}>Инакентий Валерьевич</span>
                                        </A>
                                    </div>
                                    <button className={styles.subscribe}>
                                            Подписаться
                                    </button>
                                </div>
                            </section>
                            <div className={styles.more}>
                                <div>
                                    <span>Смотреть все</span>
                                    <KeyboardArrowRightIcon className={styles.icon}/>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </main>
        </MainContainer>
    );
};

export default Profile;