import { AuthenticationError, ForbiddenError, UserInputError } from "apollo-server-express";

export class Error{
    constructor(public message: string){}
}

export default class ApiError extends Error{

    constructor(message: string){
        super(message);
    }

    static unauthorizedError(){
        return new AuthenticationError('Пользователь не авторизован');
    }

    static badRequest(mess: string){
        return new UserInputError(mess);
    }

    static forbidden(){
        return new ForbiddenError('Отказано в доступе');
    }
}