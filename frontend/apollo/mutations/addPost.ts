import { gql, useMutation } from "@apollo/client";
import getAllPosts from "../queries/getAllPosts";
import type {IGetAllPosts} from '../queries/getAllPosts';

const addPost = gql`
    mutation addPost($desc: String, $imgs: [Upload!], $videos: [Upload!]){
        createPost(desc: $desc, imgs: $imgs, videos: $videos){
            user, 
            desc, 
            imgs, 
            videos, 
            likes
        }
    }
`;

interface IAddPost_post{
    user: number,
    desc: string,
    imgs: string[],
    videos: string[],
    likes: number[],
}
interface IAddPost{
    createPost: IAddPost_post;
}

const useAddPost = () => {
    const [add, {data: addData, loading: addLoading}] = useMutation<IAddPost>(addPost);

    const mutate = (desc: string|null, imgs: FileList|null, videos: FileList|null) => {add({
        variables: {
            desc, imgs, videos
        },
        update: (cache, data) => {
            const oldPostsResponse = cache.readQuery<IGetAllPosts>({query: getAllPosts});
            const newPost = data?.data?.createPost;
            console.log(newPost, oldPostsResponse)

            if(oldPostsResponse && newPost){
                cache.writeQuery({
                    query: getAllPosts,
                    data: [
                        ...oldPostsResponse.getTimelinePosts,
                        newPost
                    ]
                });
            }
        }
    })};
    return {addPost: mutate, data: addData, loading: addLoading};
};
export default useAddPost;