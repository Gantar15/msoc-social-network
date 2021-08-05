
import type {Request, Response} from 'express';
import ApiError from '../lib/ApiError';

export default function (err: Error, req: Request, resp: Response) {
    if(err instanceof ApiError){
        return resp.status(err.status).json({messaege: err.message});
    }

    return resp.status(500).json({message: 'Непредвиденная ошибка'});
}