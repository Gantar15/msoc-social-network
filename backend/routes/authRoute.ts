
import {Router, NextFunction} from 'express';
import type {Request, Response} from 'express';
import ApiError from '../lib/ApiError';
import {body, validationResult} from 'express-validator';
import userService from '../services/userService';
const router = Router();


function setCookieToken(resp: Response, refreshToken: string){
    resp.cookie('refreshToken', refreshToken, {
        maxAge: 30*24*60*60*1000,
        httpOnly: true
    });
}

//REGISTER
router.post('/register', 
 body('name').isLength({min: 3, max: 30}).withMessage('Некорректное имя пользователя'),
 body('email').isEmail().withMessage('Некорректный email'),
 body('password').isLength({min: 6, max: 32}).withMessage('Длина пароля должна быть 6-32 символа'),
 body('password').custom(value => {
     if(!(/^(?=.*[a-z])(?=.*\d)[a-z\d!@#$%^&\*]*$/i).test(value)) throw 'Пароль обязан содержать цифры(0-9) и латинские буквы(a-z, A-Z), а так же может содердать символы !@#$%^&*';
     return true;
 }),
 async (req: Request, resp: Response, next: NextFunction) => {
    try{
        const valid = validationResult(req);
        if(!valid.isEmpty()) {
            throw ApiError.badRequest(valid.array()[0].msg);
        }

        const data: {name: string, password: string, email: string} = req.body;
        const newUser = await userService.register(data.name, data.email, data.password);
        setCookieToken(resp, newUser.refreshToken);
        resp.json(newUser);
    } catch(err){
        console.log(err);
        next(err);
    }
});

//LOGIN
router.post('/login', async (req: Request, resp: Response, next: NextFunction) => {
    try{
        const data: {email: string, password: string} = req.body;
        const userData = await userService.login(data.email, data.password);
        setCookieToken(resp, userData.refreshToken);
        resp.json(userData);
    } catch(err){
        next(err);
    }
});

//LOGOUT
router.get('/logout', async (req: Request, resp: Response, next: NextFunction) => {
    try{
        const {refreshToken} = req.cookies;
        const token = await userService.logout(refreshToken);
        resp.clearCookie('refreshToken');
        resp.json(token);
    } catch(err){
        next(err);
    }
});

//REFRESH TOKENS
router.get('/refresh', async (req: Request, resp: Response, next: NextFunction) => {
    try{
        const {refreshToken} = req.cookies;
        const userData = await userService.refresh(refreshToken);
        setCookieToken(resp, userData.refreshToken);
        resp.json(userData);
    } catch(err){
        next(err);
    }
});

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