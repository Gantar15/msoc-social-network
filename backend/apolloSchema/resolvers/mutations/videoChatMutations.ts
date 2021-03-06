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
    
        let videoRoomCandidate = await VideoRoom.findByPk(roomId);
        if(!videoRoomCandidate){
            videoRoomCandidate = await VideoRoom.create({
                id: roomId,
                users: []
            });
        }
        
        await videoRoomCandidate.update({
            users: [...videoRoomCandidate.users, authUser.id]
        });
        const roomPeers = videoRoomCandidate.users;

        roomPeers.forEach(clientId => {
            if(clientId !== authUser.id){
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
            }
        });
    
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

        videoRoom.users = videoRoom.users.filter(userId => userId !== authUser.id);
        await videoRoom.save();

        if(!videoRoom.users.length)
            await videoRoom.destroy();

        videoRoom.users.forEach(clientId => {
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

    async relayICE(_: any, {targetPeer, iceCandidate}: {targetPeer: number, iceCandidate: Object}, {resp}: IApolloContext){
        checkAuth(resp);
        const authUser: User = resp.locals.user;

        pubsub.publish(VideoCharEvents.iceCandidate, {
            targetPeer,
            peerId: authUser.id,
            iceCandidate
        });

        return true;
    },

    async relaySDP(_: any, {targetPeer, sessionDescription}: {targetPeer: number, sessionDescription: Object}, {resp}: IApolloContext){
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