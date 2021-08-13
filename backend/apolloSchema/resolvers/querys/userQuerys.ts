
import ApiError from "../../../lib/ApiError";
import errorHandler from "../../../lib/errorHandler";
import User from "../../../models/User";

export default{
    async getUser(_: any, {userId}: {userId: number}){
        try{
            const user = await User.findByPk(userId);
            if(!user) throw ApiError.badRequest('Данного пользователя не существует');
            return user;
        } catch(err){
            errorHandler(err);
        }
    },
};