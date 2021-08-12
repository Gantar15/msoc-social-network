
import {Error} from "./ApiError";
import {BaseError} from 'sequelize';
import { ValidationError, ApolloError } from "apollo-server-express";

export default function(err: Error){
    if(err instanceof ApolloError){
        throw err;
    }

    if(err instanceof BaseError){
        throw new ValidationError(err.message);
    }

    throw ("Непредвиденная ошибка на сервере");
}