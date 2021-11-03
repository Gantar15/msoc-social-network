import { withFilter } from "graphql-subscriptions";
import pubsub, {MessengesEvents} from "../../../apolloSchema/PubSub";
import {User} from '../../../models/User';


type messengePayloadData =  {messengeId: number, recipientId: number};

export default {
    watchMessenge: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([MessengesEvents.messengeSend, MessengesEvents.messengeRemove, MessengesEvents.messengeEdit]),
            (payload: messengePayloadData, _: any, {authUser}: {authUser: User | null}) => {
                return authUser?.id == payload.recipientId;
            }
        ),
        resolve: (payload: messengePayloadData) => {
            return payload.messengeId;
        }
    },
};