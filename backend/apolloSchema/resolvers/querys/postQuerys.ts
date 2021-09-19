
import errorHandler from "../../../lib/errorHandler";
import Post from "../../../models/Post";
import ApiError from "../../../lib/ApiError";
import { IApolloContext } from "../../../types/IApolloContext";
import User from "../../../models/User";
import { Op, fn, col } from "sequelize";
import { checkAuth } from "../../../middlewares/auth-middleware";
import tokenService from "../../../services/tokenService";


export default {
    async getPost(_:any, {postId}: {postId: number}){
        try{
            const post = await Post.findByPk(postId);
            if(!post) throw ApiError.badRequest('Данного поста не существует');
            return post;
        } catch(err: any){
            errorHandler(err);
        }
    },
    
    async getTimelinePosts(_: any, {limit, offset, refreshToken}: {limit: number, offset: number, refreshToken?: string}, {req, resp}: IApolloContext){
        try{
            let refreshTokenStr = refreshToken ?? req.cookies.refreshToken;

            const authUserData = await tokenService.validateRefreshToken(refreshTokenStr);
            if(!authUserData) throw ApiError.unauthorizedError();

            const userId = authUserData.id;
            const authUser = await User.findByPk(userId);
            if(!authUser) throw ApiError.unauthorizedError();

            let followinsId: number[] = [];
            if(authUser.followins)
                followinsId = authUser.followins.map((followin: number) => followin);

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

    async getTimelinePostsCount(_: any, __: any, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const userId = resp.locals.user.id;
            let followinsId: number[] = [];
            if(resp.locals.user.followins)
                followinsId = resp.locals.user.followins.map((followin: number) => followin);

            const posts: any = await Post.findAll({
                where: {
                    'user': {
                        [Op.in]: [userId, ...followinsId]
                    }
                },
                attributes: [[fn('COUNT', col('id')), 'count']]
            });

            return posts[0].dataValues.count;
        } catch(err: any){
            errorHandler(err);
        }
    },

    async getUserPosts(_: any, {userId, limit, offset}: {userId: number, limit: number, offset: number}){
        try{
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
    },

    async getUserPostsCount(_: any, {userId}: {userId: number}){
        try{
            const userData = await User.findByPk(userId);
            if(!userData){
                throw ApiError.badRequest('Указанного пользователя не существует');
            }

            const posts: any = await Post.findAll({
                where: {
                    'user': userId
                },
                attributes: [[fn('COUNT', col('id')), 'count']]
            });
            
            return posts[0].dataValues.count;
        } catch(err: any){
            errorHandler(err);
        }
    }
};