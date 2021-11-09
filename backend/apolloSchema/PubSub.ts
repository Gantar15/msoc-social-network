import {PubSub} from 'graphql-subscriptions';

const pubsub = new PubSub();
export default pubsub;

export {MessengesEvents} from './pubsubEvents/messengesEvents';
export {default as VideoCharEvents} from './pubsubEvents/videoCharEvents';