import { withFilter } from "graphql-subscriptions";
import {IMessenge} from "../../../models/Messenge";
import pubsub, {MessengesEvents} from "../../../apolloSchema/PubSub";
import {User} from '../../../models/User';


interface IMessengePayload{
    messenge: {dataValues: IMessenge};
}

export default {
    watchMessenge: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([MessengesEvents.messengeSend]),
            (payload: IMessengePayload, _: any, {authUser}: {authUser: User | null}) => {
                return authUser?.id == payload.messenge.dataValues.recipientId;
            }
        ),
        resolve: (payload: IMessengePayload) => {
            return payload.messenge;
        }
    }
};