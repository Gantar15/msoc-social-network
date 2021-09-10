import { gql, useMutation } from "@apollo/client";


const likePost = gql`
    mutation likePost($postId: Int!){
        likePost(postId: $postId)
    }
`;

const useLikePost = (postId: number) => {
    const [like] = useMutation(likePost, {
        variables: {
            postId
        }
    });

    return {likePost: like};
};
export default useLikePost;