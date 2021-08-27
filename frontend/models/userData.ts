
import {IAuthUser} from './user';

interface IUserData{
    refreshToken: string,
    accessToken: string,
    user: IAuthUser
}

export type {IUserData};