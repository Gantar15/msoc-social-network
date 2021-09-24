import { withFilter } from "graphql-subscriptions";
import {IMessenge} from "../../../models/Messenge";
import pubsub, {PubSubEvents} from "../../../apolloSchema/PubSub";
import {User} from '../../../models/User';

export default {
    watchMessenge: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([PubSubEvents.messengeSend]),
            (_: any, {recipientId}: {recipientId: number}, {authUser}: {authUser: User | null}) => {
                return recipientId == authUser?.id;
            }
        ),
        resolve: (payload: {messenge: {dataValues: IMessenge}}) => {
            return {
                ...payload.messenge.dataValues
            };
        }
    }
};