
import {Request, Response} from 'express';

interface IApolloContext {
    req: Request;
    resp: Response;
}
export type {IApolloContext};