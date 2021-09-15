
import { Response } from 'express';
import type {IApolloContext} from '../../../types/IApolloContext';
import AuthValidator from '../../../lib/authValidator';
import userService from '../../../services/userService';
import errorHandler from '../../../lib/errorHandler';
import ApiError from '../../../lib/ApiError';


function setCookieToken(resp: Response, refreshToken: string){
    resp.cookie('refreshToken', refreshToken, {
        maxAge: 30*24*60*60*1000,
        httpOnly: true
    });
}
function setSessionToken(resp: Response, refreshToken: string){
    resp.setHeader('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly`);
}

export default {
    async register(_:any, args: {name: string, email: string, password: string, repeatPassword: string}){
        const {name, email, password, repeatPassword} = args;
        try{
            if(password !== repeatPassword) throw ApiError.badRequest('Пароли не совпадают');
            
            AuthValidator.nameValidator(name);
            AuthValidator.passwordValidate(password);
            AuthValidator.emailValidate(email);

            const newUser = await userService.register(name, email, password);
            return newUser;
        } catch(err: any){
            errorHandler(err);
        }
    },

    async login(_:any, args: {email: string, password: string, isSession: boolean}, context: IApolloContext){
        const {resp} = context;
        const {email, password, isSession} = args;
        try{
            const userData = await userService.login(email, password);
            if(!isSession){
                setSessionToken(resp, userData.refreshToken);
            }
            else{
                setCookieToken(resp, userData.refreshToken);
            }
            return userData;
        } catch(err: any){
            errorHandler(err);
        }
    },

    async logout(_:any, __: any, context: IApolloContext){
        const {req, resp} = context;
        try{
            const {refreshToken} = req.cookies;
            await userService.logout(refreshToken);
            resp.clearCookie('refreshToken');
            return refreshToken;
        } catch(err: any){
            errorHandler(err);
        }
    },

    async refresh(_:any, __: any, context: IApolloContext){
        const {req, resp} = context;
        try{
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            setCookieToken(resp, userData.refreshToken);
            return userData;
        } catch(err: any){
            errorHandler(err);
        }
    }
}