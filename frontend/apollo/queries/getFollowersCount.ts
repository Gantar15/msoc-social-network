import {gql} from '@apollo/client';

const getFollowersCount = gql`
    query getFollowersCount($userId: Int!){
        getFollowersCount(userId: $userId)
    }
`;

export default getFollowersCount;

interface getFollowersCount_Query{
    getFollowersCount: number
}
export type {getFollowersCount_Query};