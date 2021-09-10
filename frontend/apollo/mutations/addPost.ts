import { gql, useMutation } from "@apollo/client";
import getAllPosts from "../queries/getAllPosts";
import getUserPosts, { IGetUserPosts } from "../queries/getUserPosts";
import type {IGetAllPosts} from '../queries/getAllPosts';

const addPost = gql`
    mutation addPost($desc: String, $imgs: [Upload!], $videos: [Upload!]){
        createPost(desc: $desc, imgs: $imgs, videos: $videos){
            user{
                id, 
                name,
                isActivated,
                email,
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
            const newPost = data?.data?.createPost;
            const oldAllPostsResponse = cache.readQuery<IGetAllPosts>({query: getAllPosts});
            
            if(oldAllPostsResponse && newPost){
                cache.writeQuery({
                    query: getAllPosts,
                    data: {
                        getTimelinePosts: [
                            newPost,
                            ...oldAllPostsResponse.getTimelinePosts
                        ]
                    }
                });
            }
            if(newPost){
                const oldUserPostsResponse = cache.readQuery<IGetUserPosts>({query: getUserPosts, variables: {
                    userId: newPost?.user
                }});
                console.log(oldUserPostsResponse)
                if(oldUserPostsResponse){
                    cache.writeQuery({
                        query: getUserPosts,
                        data: {
                            getUserPosts: [
                                newPost,
                                ...oldUserPostsResponse.getUserPosts
                            ]
                        }
                    });
                }
            }
        }
    })};
    return {addPost: mutate, data: addData, loading: addLoading};
};
export default useAddPost;