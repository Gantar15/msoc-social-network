
import {Router} from 'express';
import type {Request, Response} from 'express';
import userService from '../services/userService';
import tokenService from '../services/tokenService';
const router = Router();


//ACTIVATE PROFILE BY EMAIL
router.get('/activate/:link', async (req: Request, resp: Response) => {
    try{
        const activationLink: string = req.params.link;
        await userService.activate(activationLink);
        resp.redirect(process.env.CLIENT_URL+'/login'!);
    } catch(err){
        resp.status(400).end(err.message);
    }
});

router.get('/refreshTokenValidate', async (req: Request, resp: Response) => {
    try{
        const refreshToken: string = req.cookies.refreshToken;
        const result = tokenService.validateRefreshToken(refreshToken);
        if(result){
            resp.json(true);
        }
        else throw result;
    } catch(err){
        resp.status(400).json(err);
    }
});


export default router;