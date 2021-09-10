
import ApiError from "../../../lib/ApiError";
import errorHandler from "../../../lib/errorHandler";
import User from "../../../models/User";
import { checkAuth } from '../../../middlewares/auth-middleware';
import { IApolloContext } from "../../../types/IApolloContext";


export default{
    async getUser(_: any, {userId}: {userId: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const user = await User.findByPk(userId);
            if(!user) throw ApiError.badRequest('Данного пользователя не существует');
            return user;
        } catch(err: any){
            errorHandler(err);
        }
    },

    async getFollowins(_: any, {userId, offset, limit}: {userId: number, offset: number, limit: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const user = await User.findByPk(userId);
            if(!user) throw ApiError.badRequest('Данного пользователя не существует');

            const followinsIds = user.followins;
            const followins = followinsIds.slice(offset, limit).map(followinId => {
                return User.findByPk(followinId);
            })
            return followins;
        } catch(err: any){
            errorHandler(err);
        }
    },

    async getFollowers(_: any, {userId, offset, limit}: {userId: number, offset: number, limit: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const user = await User.findByPk(userId);
            if(!user) throw ApiError.badRequest('Данного пользователя не существует');

            const followersIds = user.followers;
            const followers = followersIds.slice(offset, limit).map(followerId => {
                return User.findByPk(followerId);
            })
            return followers;
        } catch(err: any){
            errorHandler(err);
        }
    },

    async getFollowersCount(_: any, {userId}: {userId: number}, {resp}: IApolloContext) {
        try{
            checkAuth(resp);

            const user = await User.findByPk(userId);
            if(!user) throw ApiError.badRequest('Данного пользователя не существует');

            return user.followers.length;
        } catch(err: any){
            errorHandler(err);
        }
    },

    async getFollowinsCount(_: any, {userId}: {userId: number}, {resp}: IApolloContext) {
        try{
            checkAuth(resp);

            const user = await User.findByPk(userId);
            if(!user) throw ApiError.badRequest('Данного пользователя не существует');

            return user.followins.length;
        } catch(err: any){
            errorHandler(err);
        }
    }
};