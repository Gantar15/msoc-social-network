import { Request, Response, NextFunction } from "express";
import ApiError from "../lib/ApiError";
import tokenService from "../services/tokenService";
import User from "../models/User";


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

        resp.locals.user = await User.findByPk(userData.user.id);
        next();
    } catch(err){
        return next(ApiError.unauthorizedError());
    }
}