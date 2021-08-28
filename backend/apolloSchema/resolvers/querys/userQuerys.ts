
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
        } catch(err){
            errorHandler(err);
        }
    },
};