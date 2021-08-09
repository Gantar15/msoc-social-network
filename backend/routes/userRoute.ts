
import {NextFunction, Router} from 'express';
import type {Request, Response} from 'express';
import User from '../models/User';
import authMiddleware from "../middleware/authMiddleware";
import ApiError from '../lib/ApiError';
import bcrypt from 'bcrypt';
const router = Router();


//update user
router.put('/update/:id', authMiddleware, async (req: Request, resp: Response, next: NextFunction) => {
    try{
        const candidateId = req.params.id;
        if(resp.locals.user.id !== candidateId || resp.locals.user.role !== 'admin')
            throw ApiError.forbidden();

        const user = await User.findByPk(candidateId);
        if(!user) throw ApiError.badRequest('Пользователь не найден');
        const {password} = req.body;
        if(password){
            const salt: string = await bcrypt.genSalt(18);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }
        await user.update(req.body);
        resp.json(user);
    } catch(err){
        next(err);
    }
});

//delete user
router.delete('/', authMiddleware, (req: Request, resp: Response, next: NextFunction) => {
    try{
        
    } catch(err){
        next(err);
    }
});

//get a user
router.get('/', (req: Request, resp: Response, next: NextFunction) => {
    try{
        
    } catch(err){
        next(err);
    }
});

//follow a user
router.get('/', authMiddleware, (req: Request, resp: Response, next: NextFunction) => {
    try{
        
    } catch(err){
        next(err);
    }
});

//unfollow a user
router.get('/', authMiddleware, (req: Request, resp: Response, next: NextFunction) => {
    try{
        
    } catch(err){
        next(err);
    }
});

export default router;