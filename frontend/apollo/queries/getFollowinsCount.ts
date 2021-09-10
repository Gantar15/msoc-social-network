import {gql} from '@apollo/client';

const getFollowinsCount = gql`
    query getFollowinsCount($userId: Int!){
        getFollowinsCount(userId: $userId)
    }
`;

export default getFollowinsCount;

interface getFollowinsCount_Query{
    getFollowinsCount: number
}
export type {getFollowinsCount_Query};