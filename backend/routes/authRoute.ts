
import {Router} from 'express';
import type {Request, Response} from 'express';
import userService from '../services/userService';
const router = Router();


//ACTIVATE PROFILE BY EMAIL
router.get('/activate/:link', async (req: Request, resp: Response) => {
    try{
        const activationLink: string = req.params.link;
        await userService.activate(activationLink);
        resp.redirect(process.env.CLIENT_URL!);
    } catch(err){
        resp.status(400).end(err.message);
    }
});


export default router;