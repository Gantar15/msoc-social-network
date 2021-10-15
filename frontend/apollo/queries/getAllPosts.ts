import { gql } from "@apollo/client";
import type {IPost} from '../../models/post';


const getAllPosts = gql`
    query getAllPosts($limit: Int!, $offset: Int!, $refreshToken: String){
        getTimelinePosts(limit: $limit, offset: $offset, refreshToken: $refreshToken){
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
export default getAllPosts;


interface IGetAllPosts{
    getTimelinePosts: IPost[];
}
export type {IGetAllPosts};