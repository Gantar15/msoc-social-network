import { gql } from "@apollo/client";
import type {IPost} from '../../models/post';


const getAllPosts = gql`
    query {
        getTimelinePosts{
            user{
                id, 
                name,
                profilePicture
            },
            desc,
            imgs,
            videos,
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