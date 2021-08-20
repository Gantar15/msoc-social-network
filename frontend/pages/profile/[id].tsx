
import { NextPage } from "next";
import { useRouter } from 'next/router'
import MainContainer from "../../components/MainContainer/MainContainer";
import ProfileHeader from "../../components/Profile/ProfileHeader/ProfileHeader";

import styles from '../../public/styles/profile.module.scss';


const Profile: NextPage = () => {
    const router = useRouter();
    const userId = router.query.id;

    return (
        <MainContainer activePage={1} title="Profile">
            <main className={styles.profile}>
                <ProfileHeader/>
                <section className={styles.mainContent}>
                    <section>
                        <div className={styles.posts}>
                        </div>
                    </section>
                    <section>
                        <div className={styles.friendsInformation}>
                        </div>
                        <div className={styles.friendsBlock}>
                        </div>
                    </section>
                </section>
            </main>
        </MainContainer>
    );
};

export default Profile;