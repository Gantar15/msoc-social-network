import { withFilter } from "graphql-subscriptions";
import pubsub, {VideoCharEvents} from "../../../apolloSchema/PubSub";
import type { ISubscriptionsContext } from "types/ISubscriptionsContext";


export default {
    addVideoPeer: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([VideoCharEvents.addPeer]),
            async ({targetPeer}: {targetPeer: number, createOffer: boolean, peerId: number}, _: any, {authUser}: ISubscriptionsContext) => {
                if(!authUser) return false;
                if(authUser.id != targetPeer) return false;

                return true;
            }
        ),
        resolve: (payload: {targetPeer: number, createOffer: boolean, peerId: number}) => {
            return {
                createOffer: payload.createOffer,
                peerId: payload.peerId
            };
        }
    },

    removeVideoPeer: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([VideoCharEvents.removePeer]),
            async ({targetPeer}: {targetPeer: number, peerId: number}, _: any, {authUser}: ISubscriptionsContext) => {
                if(!authUser) return false;
                if(authUser.id != targetPeer) return false;

                return true;
            }
        ),
        resolve: (payload: {targetPeer: number, peerId: number}) => {
            return {
                peerId: payload.peerId
            };
        }
    },

    sessionDescription: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([VideoCharEvents.sessionDescription]),
            async ({targetPeer}: {targetPeer: number, sessionDescription: Object}, _: any, {authUser}: ISubscriptionsContext) => {
                if(!authUser) return false;
                if(authUser.id != targetPeer) return false;

                return true;
            }
        ),
        resolve: (payload: {targetPeer: number, sessionDescription: Object}) => {
            return {
                sessionDescription: payload.sessionDescription
            };
        }
    },

    iceCandidate: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([VideoCharEvents.iceCandidate]),
            async ({targetPeer}: {targetPeer: number, iceCandidate: Object}, _: any, {authUser}: ISubscriptionsContext) => {
                if(!authUser) return false;
                if(authUser.id != targetPeer) return false;

                return true;
            }
        ),
        resolve: (payload: {targetPeer: number, iceCandidate: Object}) => {
            return {
                iceCandidate: payload.iceCandidate
            };
        }
    }
};