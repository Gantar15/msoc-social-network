
import errorHandler from "../../../lib/errorHandler";
import Post from "../../../models/Post";
import ApiError from "../../../lib/ApiError";
import { IApolloContext } from "../../../types/IApolloContext";
import { checkAuth } from "../../../middlewares/auth-middleware";
import User from "../../../models/User";
import { Op } from "sequelize";


export default {
    async getPost(_:any, {postId}: {postId: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const post = await Post.findByPk(postId);
            if(!post) throw ApiError.badRequest('Данного поста не существует');
            return post;
        } catch(err: any){
            errorHandler(err);
        }
    },
    
    async getTimelinePosts(_: any, {limit, offset}: {limit: number, offset: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const userId = resp.locals.user.id;
            let followinsId = [];
            if(resp.locals.user.followins)
                followinsId = resp.locals.user.followins.map((followin: number) => followin);

            const posts = await Post.findAll({
                where: {
                    'user': {
                        [Op.in]: [userId, ...followinsId]
                    }
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            const extPosts = await Promise.all(posts.map(async (post: any) => {
                const userData = await User.findByPk(post.user);
                return {
                    ...post.dataValues,
                    user: {
                        id: userData?.id,
                        name: userData?.name,
                        profilePicture: userData?.profilePicture
                    }
                };
            }));
            return extPosts;
        } catch(err: any){
            errorHandler(err);
        }
    },

    async getUserPosts(_: any, {userId, limit, offset}: {userId: number, limit: number, offset: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const userData = await User.findByPk(userId);
            if(!userData){
                throw ApiError.badRequest('Указанного пользователя не существует');
            }

            const posts = await Post.findAll({
                where: {
                    'user': userId
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            const extPosts = await Promise.all(posts.map(async (post: any) => {
                return {
                    ...post.dataValues,
                    user: {
                        id: userData?.id,
                        name: userData?.name,
                        profilePicture: userData?.profilePicture
                    }
                };
            }));
            return extPosts;
        } catch(err: any){
            errorHandler(err);
        }
    }
};