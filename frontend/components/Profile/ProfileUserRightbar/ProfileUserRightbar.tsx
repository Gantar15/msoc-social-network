
import {FC, memo} from 'react';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import UserMicroInf from '../../UserMicroInf/UserMicroInf';
import { IUser } from '../../../models/user';
import { useQuery } from '@apollo/client';

import styles from './profileUserRightbar.module.scss';


interface IProps{
    title: string;
    count: number;
    users: IUser[];
}

const ProfileUserRightbar: FC<IProps> = ({count, title, users}) => {

    return (
        <div className={styles.profileUserRightbar}>
            <header className={styles.titleBlock}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.indicator}>
                    <div>
                        <span>{count}</span> 
                        <PeopleAltIcon className={styles.icon}/>
                    </div>
                </div>
            </header>
            {
                count ? (
                    <>
                        <section className={styles.users}>
                            {
                                users.map(user => <UserMicroInf key={user.id} user={user}/>)
                            }
                        </section>
                        <div className={styles.more}>
                            <div>
                                <span>Смотреть все</span>
                                <KeyboardArrowRightIcon className={styles.icon}/>
                            </div>
                        </div>
                    </>
                ) : null
            }
        </div>
    );
};

export default memo(ProfileUserRightbar);