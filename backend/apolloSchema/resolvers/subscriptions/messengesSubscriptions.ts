import { withFilter } from "graphql-subscriptions";
import { IMessenge } from "../../../models/Messenge";
import pubsub, {MessengesEvents} from "../../../apolloSchema/PubSub";
import {User} from '../../../models/User';


type messengePayloadData =  {messenge: IMessenge, recipientId: number, operationType: MessengesEvents};

export default {
    watchMessenge: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([MessengesEvents.messengeSend, MessengesEvents.messengeRemove, MessengesEvents.messengeEdit]),
            ({recipientId}: messengePayloadData, _: any, {authUser}: {authUser: User | null}) => {
                return authUser?.id == recipientId;
            }
        ),
        resolve: ({messenge, operationType}: messengePayloadData) => {
            return {
                operationType, messenge
            };
        }
    },
};