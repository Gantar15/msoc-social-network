import { gql, useMutation } from "@apollo/client";
import getAllPosts from "../queries/getAllPosts";
import getUserPosts from "../queries/getUserPosts";
import apolloClient from '../client';


const dislikePost = gql`
    mutation dislikePost($postId: Int!){
        dislikePost(postId: $postId)
    }
`;

const useDislikePost = (postId: number) => {
    const [dislike] = useMutation(dislikePost, {
        variables: {
            postId
        }
    });

    return {dislikePost: dislike};
};
export default useDislikePost;