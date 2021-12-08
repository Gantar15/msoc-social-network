import { gql, useMutation } from "@apollo/client";


const dislikePost = gql`
    mutation dislikePost($postId: Int!){
        dislikePost(postId: $postId)
    }
`;

const useDislikePost = (postId: number, postsLimit: number, postsOffset: number) => {
    const [dislike] = useMutation(dislikePost, {
        variables: {
            postId
        }
    });

    return {dislikePost: dislike};
};
export default useDislikePost;