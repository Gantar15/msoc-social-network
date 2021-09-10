import {gql} from '@apollo/client';
import { IUser } from '../../models/user';

const getFollowins = gql`
    query getFollowins($userId: Int!, $limit: Int!, $offset: Int!){
        getFollowins(userId: $userId, limit: $limit, offset: $offset){
            name
        }
    }
`;

export default getFollowins;

interface getFollowins_Query{
    getFollowins: IUser[]
}
export type {getFollowins_Query};