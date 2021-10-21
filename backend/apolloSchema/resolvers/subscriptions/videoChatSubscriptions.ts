import { withFilter } from "graphql-subscriptions";
import pubsub, {VideoCharEvents} from "../../../apolloSchema/PubSub";
import {User} from '../../../models/User';
import VideoRoom from '../../../models/VideoRoom';
import {fn, col, Op, where} from 'sequelize';


export default {
    addVideoPeer: {
        subscribe: withFilter(
            () => pubsub.asyncIterator([VideoCharEvents.addPeer]),
            async (payload: { peerId: number, createOffer: boolean }, _: any, {authUser}: {authUser: User | null}) => {
                if(!authUser) return false;

                const peerCandidate = await VideoRoom.findOne({
                    where: 
                        where(fn('array_position', col('users'), authUser.id), {
                            [Op.not]: null
                        })
                });
                if(!peerCandidate)
                    return false;

                return true;
            }
        ),
        resolve: (payload: { peerId: number, createOffer: boolean }) => {
            
        }
    },
};