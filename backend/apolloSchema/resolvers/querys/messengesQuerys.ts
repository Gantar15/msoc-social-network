import errorHandler from "../../../lib/errorHandler";
import { checkAuth } from "../../../middlewares/auth-middleware";
import { IApolloContext } from "../../../types/IApolloContext";
import Messenge from "../../../models/Messenge";
import User from '../../../models/User';
import {literal, Op} from 'sequelize'; 


export default {
    async getMessenges(_: any, {recipientId}: {recipientId: number}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const messenges = await Messenge.findAll({
                where: {
                    recipientId
                },
                order: [
                    ["createdAt", "ASC"]
                ]
            });

            return messenges;
        } catch(err: any){
            errorHandler(err);
        }
    },

    async getNewestInterlocutors(_: any, __: any, {resp}: IApolloContext){
        try{
            checkAuth(resp);
            const authUserId: number = resp.locals.user.id;

            const newestAuthUserMessenges = await Messenge.findAll({
                attributes: [
                    [literal('DISTINCT "Messenge"."recipientId"'), 'recipientId']
                ],
                where: {
                    authorId: authUserId
                }
            });
            const newestInterlocutors = await User.findAll({
                attributes: ['id', 'name', 'profilePicture'],
                where: {
                    id: newestAuthUserMessenges.map(mess => mess.recipientId)
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

            const newestAuthUserMessenges = await Messenge.findAll({
                attributes: [
                    [literal('DISTINCT "Messenge"."recipientId"'), 'recipientId']
                ],
                where: {
                    authorId: authUserId
                }
            });
            
            const newestInterlocutorsIds = newestAuthUserMessenges.map(({recipientId}) => recipientId);
            const newestMessenges = await Promise.all(newestInterlocutorsIds.map(async (interlocutorId) => {
                return await Messenge.findOne({
                    where: {
                        [Op.or]: {
                            [Op.and]: {
                                authorId: authUserId,
                                recipientId: interlocutorId
                            },
                            [Op.and]: {
                                authorId: interlocutorId,
                                recipientId: authUserId
                            }
                        }
                    },
                    order: [
                        ["createdAt", "DESC"]
                    ],
                });
            }));
            
            return newestMessenges;
        } catch(err: any){
            errorHandler(err);
        }
    }
};