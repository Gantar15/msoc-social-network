import { gql } from "@apollo/client";


const getAllPosts = gql`
    query {
        getTimelinePosts{
            user,
            desc,
            imgs,
            videos,
            likes,
        }
    }
`;
export default getAllPosts;

interface IGetAllPosts_post{
    user: number,
    desc: string,
    imgs: string[],
    videos: string[],
    likes: number[],
}
interface IGetAllPosts{
    getTimelinePosts: IGetAllPosts_post[];
}
export type {IGetAllPosts, IGetAllPosts_post};