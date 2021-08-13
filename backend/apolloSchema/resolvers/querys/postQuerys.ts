
import errorHandler from "../../../lib/errorHandler";
import Post from "../../../models/Post";
import ApiError from "../../../lib/ApiError";
import { IApolloContext } from "../../../types/IApolloContext";
import { checkAuth } from "../../../middlewares/auth-middleware";
import User from "../../../models/User";


export default {
    async getPost(_:any, {postId}: {postId: number}){
        try{
            const post = await Post.findByPk(postId);
            if(!post) throw ApiError.badRequest('Данного поста не существует');
            return post;
        } catch(err){
            errorHandler(err);
        }
    },
    
    async getTimelinePosts(_: any, __: any, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const currenntUser: User = resp.locals.user;
            const userPosts = await resp.locals.user.getPosts();
            const friedPosts = await Promise.all(currenntUser.followins.map(async (friendId) => {
                const friend = await User.findByPk(friendId);
                return friend?.getPosts();
            }));

            return [...userPosts, ...friedPosts];
        } catch(err){
            errorHandler(err);
        }
    }
};