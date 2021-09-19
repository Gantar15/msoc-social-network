import { gql, useMutation } from "@apollo/client";
import apolloClient from "../client";
import getAllPosts from "../queries/getAllPosts";
import getUserPosts from "../queries/getUserPosts";


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