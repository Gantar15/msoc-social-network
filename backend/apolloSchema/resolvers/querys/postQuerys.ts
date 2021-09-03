
import errorHandler from "../../../lib/errorHandler";
import Post from "../../../models/Post";
import ApiError from "../../../lib/ApiError";
import { IApolloContext } from "../../../types/IApolloContext";
import { checkAuth } from "../../../middlewares/auth-middleware";
import User from "../../../models/User";


export default {
    async getPost(_:any, {postId}: {postId: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const post = await Post.findByPk(postId);
            if(!post) throw ApiError.badRequest('Данного поста не существует');
            return post;
        } catch(err){
            errorHandler(err);
        }
    },
    
    async getTimelinePosts(_: any, {limit, offset}: {limit: number, offset: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            // const currentUser: User = resp.locals.user;
            // const userPosts = await resp.locals.user.getPosts();
            // const friedPosts = await Promise.all(currentUser.followins.map(async (friendId) => {
            //     const friend = await User.findByPk(friendId);
            //     return friend?.getPosts();
            // }));

            // return [...userPosts, ...friedPosts];

            const posts = await resp.locals.user.findAll({
                include: {
                    model: User,
                    required: true,
                    include: {
                        required: true,
                        model: Post
                    }
                },
                order: [[Post, 'createdAt', 'ASC']],
                limit,
                offset
            });
            
            return posts;
        } catch(err){
            errorHandler(err);
        }
    }
};