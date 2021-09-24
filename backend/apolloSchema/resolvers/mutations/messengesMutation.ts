import errorHandler from "../../../lib/errorHandler";
import { IApolloContext } from "../../../types/IApolloContext";
import Messenge from "../../../models/Messenge";
import pubsub, {PubSubEvents} from "../../PubSub";
import ApiError from "../../../lib/ApiError";
import { checkAuth } from "../../../middlewares/auth-middleware";
import User from "../../../models/User";

export default {
    async sendMessenge(_: any, {recipientId, messenge}: {recipientId: number, messenge: string}, {resp}: IApolloContext){
        try{
            checkAuth(resp);

            const recipientCandidate = await User.findByPk(recipientId);
            if(!recipientCandidate) throw ApiError.badRequest('Получатель не найден');

            const messengeObj = await Messenge.create({
                recipientId: recipientId,
                authorId: resp.locals.user.id,
                text: messenge
            });
            pubsub.publish(PubSubEvents.messengeSend, messengeObj);
            
            return messengeObj;
        } catch(err: any){
            errorHandler(err);
        }
    }
};