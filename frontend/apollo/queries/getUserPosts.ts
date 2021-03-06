import { gql } from "@apollo/client";
import type {IPost} from '../../models/post';


const getUserPosts = gql`
    query getUserPosts($userId: Int!, $limit: Int!, $offset: Int!){
        getUserPosts(userId: $userId, limit: $limit, offset: $offset){
            user{
                id, 
                name,
                profilePicture
            },
            desc,
            imgs,
            videos,
            audios,
            likes,
            id,
            dislikes,
            comments,
            createdAt,
            shareCount
        }
    }
`;
export default getUserPosts;


interface getUserPosts_Query{
    getUserPosts: IPost[];
}
export type {getUserPosts_Query};