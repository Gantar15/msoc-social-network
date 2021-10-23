import User from "models/User";
import { checkAuth } from "../../../middlewares/auth-middleware";
import VideoRoom from "../../../models/VideoRoom";
import { IApolloContext } from "../../../types/IApolloContext";
import {fn, col, Op, where} from 'sequelize';
import pubsub, { VideoCharEvents } from "../../PubSub";


export default {
    async joinVideoRoom(_: any, {roomId}: {roomId: number}, {resp}: IApolloContext) {
        checkAuth(resp);
        const authUser: User = resp.locals.user;
        
        const existingRoom = await VideoRoom.findOne({
            where:
                where(fn('array_position', col('users'), authUser.id), {
                    [Op.not]: null
                })
        });
        if(existingRoom)
            return false;
    
        const videoRoomCandidate = await VideoRoom.findByPk(roomId);
        if(videoRoomCandidate){
            videoRoomCandidate.users.push(authUser.id);
            await videoRoomCandidate.save();
            const roomPeers = videoRoomCandidate.users;
    
            roomPeers.forEach(clientId => {
                pubsub.publish(VideoCharEvents.addPeer, {
                    peerId: clientId,
                    createOffer: true,
                    targetPeer: authUser.id
                });
    
                pubsub.publish(VideoCharEvents.addPeer, {
                    peerId: authUser.id,
                    createOffer: false,
                    targetPeer: clientId
                });
            });
        }
        else
            return false;
    
        return true;
    },

    async leaveVideoRoom(_: any, __: any, {resp}: IApolloContext){
        checkAuth(resp);
        const authUser: User = resp.locals.user;
        
        const videoRoom = await VideoRoom.findOne({
            where:
                where(fn('array_position', col('users'), authUser.id), {
                    [Op.not]: null
                })
        });
        if(!videoRoom) return false;

        const peerIndex = videoRoom.users.findIndex(userId => userId == authUser.id);
        videoRoom.users.splice(peerIndex, 1);
        await videoRoom.save();
        const roomPeers = videoRoom.users;

        roomPeers.forEach(clientId => {
            pubsub.publish(VideoCharEvents.removePeer, {
                targetPeer: clientId,
                peerId: authUser.id
            });

            pubsub.publish(VideoCharEvents.removePeer, {
                targetPeer: authUser.id,
                peerId: clientId
            });
        });

        return true;
    },

    async relayICE(_: any, {targetPeer, iceCandidate}: {targetPeer: number, iceCandidate: string}, {resp}: IApolloContext){
        checkAuth(resp);
        const authUser: User = resp.locals.user;

        pubsub.publish(VideoCharEvents.iceCandidate, {
            targetPeer,
            peerId: authUser.id,
            iceCandidate
        });

        return true;
    },

    async relaySDP(_: any, {targetPeer, sessionDescription}: {targetPeer: number, sessionDescription: string}, {resp}: IApolloContext){
        checkAuth(resp);
        const authUser: User = resp.locals.user;
        
        pubsub.publish(VideoCharEvents.sessionDescription, {
            targetPeer,
            peerId: authUser.id,
            sessionDescription
        });

        return true;
    }
};