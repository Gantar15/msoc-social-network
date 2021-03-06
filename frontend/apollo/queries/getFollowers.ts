import {gql} from '@apollo/client';
import { IUser } from '../../models/user';

const getFollowers = gql`
    query getFollowers($userId: Int!, $limit: Int!, $offset: Int!){
        getFollowers(userId: $userId, limit: $limit, offset: $offset){
            name, id, followers, followins
        }
    }
`;
export default getFollowers;

interface getFollowers_Query{
    getFollowers: IUser[]
}
export type {getFollowers_Query};