import React, {FC, memo} from 'react'
import { IMessenge } from '../../../models/messenge';
import getAuthUser from '../../../apollo/queries/getAuthUser';
import type { IAuthUser } from "../../../models/user";
import { useQuery } from '@apollo/client';

import styles from './messenge.module.scss';


interface IProps {
    messenge: IMessenge;
    key: number;
}

const Messenge: FC<IProps> = ({messenge, key}) => {
    const {data: authUser} = useQuery<{getAuthUser: IAuthUser}>(getAuthUser);
    const isOurs = authUser?.getAuthUser.id == messenge.authorId;
    
    if(isOurs)
        return (
            <section key={key} className={styles.messenge + ' ' + styles.ours}>
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
        );

    return (
        <section key={key} className={styles.messenge + ' ' + styles.theirs}>
            <span className={styles.messengeDate}>
                {
                    new Date(+messenge.createdAt).toLocaleString('ru', {
                        hour: '2-digit', minute: '2-digit'
                    })
                }
            </span>
            <p className={styles.messengeText}>
                {
                    messenge.text
                }
            </p>
        </section>
    )
};

export default memo(Messenge);