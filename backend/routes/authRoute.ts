
import {Router, NextFunction} from 'express';
import type {Request, Response} from 'express';
import userService from '../services/userService';
const router = Router();


//ACTIVATE PROFILE BY EMAIL
router.get('/activate/:link', async (req: Request, resp: Response, next: NextFunction) => {
    try{
        const activationLink: string = req.params.link;
        await userService.activate(activationLink);
        resp.redirect(process.env.CLIENT_URL!);
    } catch(err){
        next(err);
    }
});


export default router;