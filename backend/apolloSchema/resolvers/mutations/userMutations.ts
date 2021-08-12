
import errorHandler from '../../../lib/errorHandler';
import ApiError from '../../../lib/ApiError';
import type {IApolloContext} from '../../../types/IApolloContext';
import User from '../../../models/User';
import userService from '../../../services/userService';
import mailService from '../../../services/mailService';
import { checkAuth } from '../../../middlewares/auth-middleware';
import AuthValidator from '../../../lib/authValidator';
import type {IUser} from '../../../models/User';
import bcrypt from 'bcrypt';
import uuid from 'uuid';
import Token from '../../../models/Token';


export default {
    async updateUser(_:any, {userId, user: userUpdateData}: {userId: number, user: IUser}, {req, resp}: IApolloContext){
        try{
            checkAuth(resp);

            if(resp.locals.user.id != userId && resp.locals.user.role !== 'admin')
                throw ApiError.forbidden();
    
            const user = await User.findByPk(userId);
            if(!user) throw ApiError.badRequest('Пользователь не найден');
            await user.update(userUpdateData);
    
            const {password, email, 
                from, city, 
                desc, name } = userUpdateData;
            if(password){
                AuthValidator.passwordValidate(password);
                const salt: string = await bcrypt.genSalt(18);
                const hashedPassword = await bcrypt.hash(password, salt);
                user.password = hashedPassword;
                userService.logout(req.cookies.refreshToken);
                await user.save();
            }
            if(email){
                AuthValidator.emailValidate(email);
                const activationLink = uuid.v4();
                await mailService.sendMail(user.name, email, process.env.SITE_URL+'/auth/activate/'+activationLink);
                user.isActivated = false;
                user.activationLink = activationLink;
                userService.logout(req.cookies.refreshToken);
                await user.save();
            }

            from && AuthValidator.lengthValidate(from, [2, 50], 'Длина названия места вашего рождения должна быть 2-50 символов');
            city && AuthValidator.lengthValidate(city, [2, 50], 'Длина названия города должна быть 2-50 символов');
            desc && AuthValidator.lengthValidate(desc, [2, 50], 'Длина описания должна быть 3-50 символов');
            name && AuthValidator.nameValidator(name);

            return user;
        } catch(err){
            errorHandler(err);
        }
    },

    async deleteUser(_:any, {userId}: {userId: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            if(resp.locals.user.id != userId && resp.locals.user.role !== 'admin')
                throw ApiError.forbidden();

            const user = await User.findByPk(userId);
            if(!user) throw ApiError.badRequest('Данного пользователя не существует');
            const refreshToken = (await user.getToken()).refreshToken;
            await user.destroy();

            if(resp.locals.user.id === userId) {
                userService.logout(refreshToken);
                resp.clearCookie('refreshToken');
            }
            
            return user;
        } catch(err){
            errorHandler(err);
        }
    },

    async getUser(_: any, {userId}: {userId: number}){
        try{
            const user = await User.findByPk(userId);
            if(!user) throw ApiError.badRequest('Данного пользователя не существует');
            return user;
        } catch(err){
            errorHandler(err);
        }
    },

    async follow(_: any, {userId}: {userId: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const currentUser: User = resp.locals.user;
            const user = await User.findByPk(userId);

            if(!user) throw ApiError.badRequest('Данного пользователя не существует');
            if(!user.followers.includes(currentUser.id.toString())){
                await user.update({
                    followers: [...user.followers, currentUser.id.toString()]
                });
                await currentUser.update({
                    followins: [...currentUser.followins, user.id.toString()]
                });
                return true;
            }

            return false;
        } catch(err){
            console.log(err)
            errorHandler(err);
        }
    }
};