
import bcrypt from 'bcrypt';
import User from '../models/User';
import ApiError from '../lib/ApiError';
import tokenService, {ITokensList} from './tokenService';
import mailService from './mailService';
import UserDto, {IUserDto} from '../lib/UserDto';
import Token from '../models/Token';
const uuid = require('uuid');


interface INewUserData extends ITokensList{
    user: IUserDto
}

async function updateTokens(user: User): Promise<INewUserData>{
    const userDto = new UserDto(user);
    const tokens: ITokensList = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(user, tokens.refreshToken);
    return {
        ...tokens,
        user: userDto
    }
}

class UserService{
    async register(name: string, email: string, password: string): Promise<User>{
        const existUser = await User.findOne({where: {email}});
        if(existUser) throw ApiError.badRequest('Пользователь с данным email уже существует');

        const salt: string = await bcrypt.genSalt(18);
        const hashedPassword: string = await bcrypt.hash(password, salt);
        const activationLink: string = uuid.v4();
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            activationLink
        });

        await mailService.sendMail(name, email, process.env.SITE_URL+'/auth/activate/'+activationLink);
        return newUser;
    }

    async activate(activationLink: string){
        const user = await User.findOne({where: {activationLink}});

        if(!user){
            throw ApiError.badRequest(`${activationLink} - некорректная ссылка активации`);
        }

        user.isActivated = true;
        user.activationLink = '';
        await user!.save();
    }

    async login(email: string, password: string): Promise<INewUserData>{
        const user = await User.findOne({where: {email}});
        if(!user){
            throw ApiError.badRequest('Пользователь с указанной почтой не найден');
        }
        if(!user.isActivated){
            throw ApiError.badRequest('Подтвердите почту');
        }
        const isPassValid: boolean = await bcrypt.compare(password, user.password);
        if(!isPassValid){
            throw ApiError.badRequest('Неверный пароль');
        }

        return await updateTokens(user);
    }

    async logout(refreshToken: string): Promise<Token | null>{
        if(!refreshToken) throw ApiError.unauthorizedError();
        const token = await Token.findOne({where: {refreshToken}});
        if(token)
            await tokenService.removeToken(token);
        return token;
    }

    async refresh(refreshToken: string): Promise<INewUserData> {
        if(!refreshToken) throw ApiError.unauthorizedError();

        const userId = (await Token.findOne({
            where: {
                refreshToken
            }
        }))?.user;
        if(!userId) throw ApiError.unauthorizedError();
        const user = await User.findByPk(userId);
        const userData = tokenService.validateRefreshToken(refreshToken);
        if(!user || !userData) throw ApiError.unauthorizedError();

        return await updateTokens(user);
    }
}

export default new UserService();