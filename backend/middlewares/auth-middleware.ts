import { Request, Response, NextFunction } from "express";
import tokenService from "../services/tokenService";
import ApiError from '../lib/ApiError';
import User from "../models/User";


export function checkAuth(resp: Response): void{
    if(!resp.locals.user) throw ApiError.unauthorizedError();
}


export default async function(req: Request, resp: Response, next: NextFunction){
    try{
        const accessToken: string | undefined = req.get('authorization')?.split(' ')[1];
        
        if(!accessToken){
            throw null;
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData){
            throw null;
        }
        
        resp.locals.user = await User.findByPk(userData.id);
        next();
    } catch(err){
        next();
    }
}