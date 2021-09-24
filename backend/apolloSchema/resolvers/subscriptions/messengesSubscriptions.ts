import pubsub, {PubSubEvents} from "../../../apolloSchema/PubSub";
import {User} from '../../../models/User';

export default {
    watchMessenge: {
        subscribe: (_: any, {recipientId}: {recipientId: number}, {authUser}: {authUser: User | null} ) => {
            if(recipientId == authUser?.id)
                return pubsub.asyncIterator([PubSubEvents.messengeSend]);
        }
    }
};