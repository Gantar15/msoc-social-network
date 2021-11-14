
import type {IUser} from './user';

interface IUserData{
    refreshToken: string,
    accessToken: string,
    user: IUser
}

export type {IUserData};