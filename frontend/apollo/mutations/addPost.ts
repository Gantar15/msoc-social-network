import { gql, useMutation } from "@apollo/client";

const addPost = gql`
    mutation addPost($desc: String, $imgs: [Upload!], $videos: [Upload!]){
        createPost(desc: $desc, imgs: $imgs, videos: $videos){
            user, imgs, videos
        }
    }
`;

const useAddPost = () => {
    const [add, {data: addData, loading: addLoading}] = useMutation(addPost);

    const mutate = (desc: string|null, imgs: FileList|null, videos: FileList|null) => {add({
        variables: {
            desc, imgs, videos
        }
    })};
    return {addPost: mutate, data: addData, loading: addLoading};
};
export default useAddPost;