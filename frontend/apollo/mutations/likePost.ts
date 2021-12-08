import { gql, Reference, useMutation } from "@apollo/client";
import getAllPosts, {IGetAllPosts} from "../queries/getAllPosts";
import getUserPosts from "../queries/getUserPosts";


const likePost = gql`
    mutation likePost($postId: Int!){
        likePost(postId: $postId)
    }
`;

const useLikePost = (postId: number, postsLimit: number, postsOffset: number) => {
    const [like] = useMutation(likePost, {
        variables: {
            postId
        },
        update(cache){
            const cachedPosts = cache.readQuery<IGetAllPosts>({
                query: getAllPosts,
                variables: {
                    limit: postsLimit,
                    offset: postsOffset,
                    // refreshToken: 
                }
            });
            console.log(cachedPosts)
            if(cachedPosts){
                const likedPost = cachedPosts.getTimelinePosts.find(post => post.id == postId);
                console.log(likedPost)
                if(likedPost)
                    cache.modify({
                        //@ts-expect-error
                        id: cache.identify(likedPost),
                        fields: {
                            likes(...s){
                                console.log(s)
                            }
                        }
                    });
            }

        }
    });

    return {likePost: like};
};
export default useLikePost;