import { withFilter } from "graphql-subscriptions";
import pubsub, {VideoCharEvents} from "../../../apolloSchema/PubSub";
import {User} from '../../../models/User';


interface IAddVideoPeerPayload{
    targetPeer: number,
    createOffer: boolean,
    peerId: number
}

export default {
    addVideoPeer: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([VideoCharEvents.addPeer]),
            async ({targetPeer}: {targetPeer: number, createOffer: boolean, peerId: number}, _: any, {authUser}: {authUser: User | null}) => {
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
            async ({targetPeer}: {targetPeer: number, peerId: number}, _: any, {authUser}: {authUser: User | null}) => {
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
            async ({targetPeer}: {targetPeer: number, sessionDescription: string}, _: any, {authUser}: {authUser: User | null}) => {
                if(!authUser) return false;
                if(authUser.id != targetPeer) return false;

                return true;
            }
        ),
        resolve: (payload: {targetPeer: number, sessionDescription: string}) => {
            return {
                sessionDescription: payload.sessionDescription
            };
        }
    },

    iceCandidate: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([VideoCharEvents.iceCandidate]),
            async ({targetPeer}: {targetPeer: number, iceCandidate: string}, _: any, {authUser}: {authUser: User | null}) => {
                if(!authUser) return false;
                if(authUser.id != targetPeer) return false;

                return true;
            }
        ),
        resolve: (payload: {targetPeer: number, iceCandidate: string}) => {
            return {
                iceCandidate: payload.iceCandidate
            };
        }
    }
};