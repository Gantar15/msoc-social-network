import {PubSub} from 'graphql-subscriptions';

const pubsub = new PubSub();
export default pubsub;

export const PubSubEvents = {
    messengeSend: 'MESSENGE_SEND'
};