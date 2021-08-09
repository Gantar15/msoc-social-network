
export class Error{
    constructor(public message: string){}
}

export default class ApiError extends Error{
    status: number;

    constructor(status: number, message: string){
        super(message);
        this.status = status;
        this.message = message;
    }

    static badRequest(message: string){
        return new ApiError(400, message);
    }

    static notFound(){
        return new ApiError(404, 'Ресурс не найден');
    }

    static internal(message: string){
        return new ApiError(500, message);
    }

    static forbidden(){
        return new ApiError(403, 'Отказано в доступе');
    }

    static unauthorizedError(){
        return new ApiError(401, 'Пользователь не авторизирован');
    }
}