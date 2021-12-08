import errorHandler from "../../../lib/errorHandler";
import { checkAuth } from "../../../middlewares/auth-middleware";
import { IApolloContext } from "../../../types/IApolloContext";
import Messenge from "../../../models/Messenge";
import User from '../../../models/User';
import {literal, Op} from 'sequelize'; 
import ApiError from "../../../lib/ApiError";
import tokenService from "../../../services/tokenService";
import AccordFile from "../../../models/AccordFile";
import provideMessengeDocuments from "../../../lib/provideMessengeDocuments";


export default {
    async getMessenges(_: any, {recipientId}: {recipientId: number}, {req}: IApolloContext){
        try{
            const accessTokenStr = req.headers.authorization!;
            const authUserData = tokenService.validateAccessToken(accessTokenStr);
            if(!authUserData) throw ApiError.unauthorizedError();

            const authUserId = authUserData.id;
            const authUser = await User.findByPk(authUserId);
            if(!authUser) throw ApiError.unauthorizedError();

            const messenges = await Messenge.findAll({
                where: {
                    [Op.or]: [
                        {authorId: authUserId, recipientId},
                        {authorId: recipientId, recipientId: authUserId}
                    ],
                    clientInvisibility: false
                },
                order: [
                    ["createdAt", "ASC"]
                ]
            });

            for (let index = 0; index < messenges.length; index++) {
                const messenge = messenges[index];
                await provideMessengeDocuments(messenge);
            }
            return messenges;
        } catch(err: any){
            errorHandler(err);
        }
    },

    async getNewestInterlocutors(_: any, __: any, {resp}: IApolloContext){
        try{
            checkAuth(resp);
            const authUserId: number = resp.locals.user.id;

            const newestFromAuthUserMessenges = await Messenge.findAll({
                attributes: [
                    [literal('DISTINCT "Messenge"."recipientId"'), 'recipientId']
                ],
                where: {authorId: authUserId}
            });
            const newestToAuthUserMessenges = await Messenge.findAll({
                attributes: [
                    [literal('DISTINCT "Messenge"."authorId"'), 'authorId']
                ],
                where: {recipientId: authUserId}
            });

            let newestInterlocutorsIds = newestFromAuthUserMessenges.map(({recipientId}) => recipientId).
                concat(newestToAuthUserMessenges.map(({authorId}) => authorId));

            newestInterlocutorsIds = newestInterlocutorsIds.reduce((all: number[], id) => {
                if(!all.includes(id))
                    all.push(id);
                return all;
            }, []);
            const newestInterlocutors = await User.findAll({
                attributes: ['id', 'name', 'profilePicture'],
                where: {
                    id: newestInterlocutorsIds
                }
            });

            return newestInterlocutors;
        } catch(err: any){
            errorHandler(err);
        }
    },

    async getNewestMessenges(_: any, __: any, {resp}: IApolloContext){
        try{
            checkAuth(resp);
            const authUserId: number = resp.locals.user.id;

            const newestFromAuthUserMessenges = await Messenge.findAll({
                attributes: [
                    [literal('DISTINCT "Messenge"."recipientId"'), 'recipientId']
                ],
                where: {authorId: authUserId}
            });
            const newestToAuthUserMessenges = await Messenge.findAll({
                attributes: [
                    [literal('DISTINCT "Messenge"."authorId"'), 'authorId']
                ],
                where: {recipientId: authUserId}
            });
            
            let newestInterlocutorsIds = newestFromAuthUserMessenges.map(({recipientId}) => recipientId).
                concat(newestToAuthUserMessenges.map(({authorId}) => authorId));

            newestInterlocutorsIds = newestInterlocutorsIds.reduce((all: number[], id) => {
                if(!all.includes(id))
                    all.push(id);
                return all;
            }, []);
            let newestMessenges = await Promise.all(newestInterlocutorsIds.map(async (interlocutorId) => {
                return await Messenge.findOne({
                    where: {
                        [Op.or]: [
                            {
                                [Op.and]: {
                                    authorId: authUserId,
                                    recipientId: interlocutorId
                                }
                            },
                            {
                                [Op.and]: {
                                    authorId: interlocutorId,
                                    recipientId: authUserId
                                }
                            }
                        ]
                    },
                    order: [
                        ["createdAt", "DESC"]
                    ],
                    include: AccordFile
                });
            }));

            newestMessenges = newestMessenges.filter(el => !!el);
            newestMessenges.forEach(async (newestMessenge) => {
                if(newestMessenge)
                    await provideMessengeDocuments(newestMessenge);
            });
            return newestMessenges;
        } catch(err: any){
            errorHandler(err);
        }
    }
};