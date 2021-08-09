
import jwt from 'jsonwebtoken';
import { IUserDto } from '../lib/UserDto';
import Token from "../models/Token";
import type User from '../models/User';


interface ITokensList{
    accessToken: string;
    refreshToken: string;
}
export type {ITokensList};

interface INewUserData extends ITokensList{
    user: IUserDto
}
export type {INewUserData};


class TokenService{
    generateTokens(payload: any): ITokensList{
        const refreshToken = jwt.sign(payload, 
            process.env.REFRESH_TOKEN_SECRET_KEY!, {
                expiresIn: '30d'
            });
        const accessToken = jwt.sign(payload, 
            process.env.ACCESS_TOKEN_SECRET_KEY!, {
                expiresIn: '25m'
            });

        return {
            refreshToken,
            accessToken
        }
    }

    async saveToken(user: User, refreshToken: string){
        const existToken = await user.getToken();
        if(existToken){
            existToken.setDataValue('refreshToken', refreshToken);
            return await existToken.save();
        }

        const newToken = user.createToken({
            refreshToken
        });
        return newToken;
    }

    async removeToken(refreshToken: string): Promise<Token | null>{
        const token = await Token.findOne({where: {refreshToken}});
        token?.destroy();
        return token;
    }

    validateAccessToken(accessToken: string): INewUserData|null{
        try{
            const userData = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY!) as INewUserData;
            return userData;
        } catch(err){
            return null;
        }
    }

    validateRefreshToken(refreshToken: string): INewUserData|null{
        try{
            const userData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY!) as INewUserData;
            return userData;
        } catch(err){
            return null;
        }
    }
}

export default new TokenService();