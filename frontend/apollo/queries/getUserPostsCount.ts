import { gql } from "@apollo/client";


const getUserPostsCount = gql`
    query getUserPostsCount($userId: Int!){
        getUserPostsCount(userId: $userId)
    }
`;
export default getUserPostsCount;

interface userPostsCount_Query{
    getUserPostsCount: number
}
export type {userPostsCount_Query};