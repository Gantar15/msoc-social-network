import React, {FC, memo} from 'react'
import { IMessenge } from '../../../models/messenge';
import getAuthUser from '../../../apollo/queries/getAuthUser';
import type { IAuthUser } from "../../../models/user";
import { useQuery } from '@apollo/client';

import styles from './messenge.module.scss';


interface IProps {
    messenge: IMessenge;
}

const Messenge: FC<IProps> = ({messenge}) => {
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    const isOurs = authUser?.getAuthUser.id == messenge.authorId;
console.log(messenge)
    return (
        <section className={styles.messenge + (isOurs ? ' ' + styles.ours : ' ' + styles.theirs)}>
            <p className={styles.messengeText}>
                {
                    messenge.text
                }
            </p>
            <span className={styles.messengeDate}>
                {
                    new Date(+messenge.createdAt).toLocaleString('ru', {
                        hour: '2-digit', minute: '2-digit'
                    })
                }
            </span>
        </section>
    )
};

export default memo(Messenge);