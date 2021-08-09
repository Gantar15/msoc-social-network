
import type {NextFunction, Request, Response} from 'express';
import ApiError, {Error} from '../lib/ApiError';

export default function (err: Error, req: Request, resp: Response, next: NextFunction) {
    if(err instanceof ApiError){
        return resp.status(err.status).json({message: err.message});
    }

    return resp.status(500).json({message: 'Непредвиденная ошибка'});
}