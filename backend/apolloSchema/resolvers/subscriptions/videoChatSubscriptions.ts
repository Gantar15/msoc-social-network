import { withFilter } from "graphql-subscriptions";
import pubsub, {VideoCharEvents} from "../../../apolloSchema/PubSub";
import type { ISubscriptionsContext } from "types/ISubscriptionsContext";


type addVideoPeerPayload = {targetPeer: number, createOffer: boolean, peerId: number};
type removeVideoPeerPayload = {targetPeer: number, peerId: number};
type icecandidatePayload = {targetPeer: number, iceCandidate: Object, peerId: number};
type sessionDescriptionPayload = {targetPeer: number, sessionDescription: Object, peerId: number};

export default {
    addVideoPeer: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([VideoCharEvents.addPeer]),
            async ({targetPeer}: addVideoPeerPayload, _: any, {authUser}: ISubscriptionsContext) => {
                if(!authUser) return false;
                if(authUser.id != targetPeer) return false;

                return true;
            }
        ),
        resolve: (payload: addVideoPeerPayload) => {
            return {
                createOffer: payload.createOffer,
                peerId: payload.peerId
            };
        }
    },

    removeVideoPeer: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([VideoCharEvents.removePeer]),
            async ({targetPeer}: removeVideoPeerPayload, _: any, {authUser}: ISubscriptionsContext) => {
                if(!authUser) return false;
                if(authUser.id != targetPeer) return false;

                return true;
            }
        ),
        resolve: (payload: removeVideoPeerPayload) => {
            return {
                peerId: payload.peerId
            };
        }
    },

    sessionDescription: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([VideoCharEvents.sessionDescription]),
            async ({targetPeer}: sessionDescriptionPayload, _: any, {authUser}: ISubscriptionsContext) => {
                if(!authUser) return false;
                if(authUser.id != targetPeer) return false;

                return true;
            }
        ),
        resolve: ({sessionDescription, peerId}: sessionDescriptionPayload) => {
            return {
                sessionDescription,
                peerId
            };
        }
    },

    iceCandidate: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([VideoCharEvents.iceCandidate]),
            async ({targetPeer}: icecandidatePayload, _: any, {authUser}: ISubscriptionsContext) => {
                if(!authUser) return false;
                if(authUser.id != targetPeer) return false;

                return true;
            }
        ),
        resolve: ({iceCandidate, peerId}: icecandidatePayload) => {
            return {
                iceCandidate,
                peerId
            };
        }
    }
};