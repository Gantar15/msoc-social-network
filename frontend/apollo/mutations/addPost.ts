import { gql, useMutation } from "@apollo/client";
import getAllPosts from "../queries/getAllPosts";
import getAllPostsCount from "../queries/getAllPostsCount";

const addPost = gql`
    mutation addPost($desc: String, $imgs: [Upload!], $videos: [Upload!], $audios: [Upload!]){
        createPost(desc: $desc, imgs: $imgs, videos: $videos, audios: $audios){
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

interface IAddPost_post{
    user: number,
    desc: string,
    imgs: string[],
    videos: string[],
    audios: string[],
    likes: number[],
}
interface IAddPost{
    createPost: IAddPost_post;
}

const useAddPost = () => {
    const [add, {data: addData, loading: addLoading}] = useMutation<IAddPost>(addPost);

    const mutate = (limit: number, desc: string|null, imgs: FileList|null, videos: FileList|null, audios: FileList|null) => {add({
        variables: {
            desc, imgs, videos, audios
        },
        update: (cache, data) => {
            const oldData: {getTimelinePosts: any[]}|null = cache.readQuery({
                query: getAllPosts,
                variables: {
                    offset: 0,
                    limit
                }
            });

            if(oldData && data.data)
                cache.writeQuery({
                    query: getAllPosts,
                    variables: {
                        offset: 0,
                        limit
                    },
                    data: {
                        getTimelinePosts: [data.data.createPost, ...oldData.getTimelinePosts]
                    }
                });
        },
        refetchQueries: [getAllPostsCount]
    })};
    return {addPost: mutate, data: addData, loading: addLoading};
};
export default useAddPost;