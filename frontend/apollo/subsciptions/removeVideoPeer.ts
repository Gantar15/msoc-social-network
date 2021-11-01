import { gql } from "@apollo/client";


const removeVideoPeer = gql`
    subscription removeVideoPeer {
        removeVideoPeer {
            peerId
        }
    }
`;
export default removeVideoPeer;

interface removeVideoPeer_Subscription{
    removeVideoPeer: {
        peerId: number
    }
}
export type {removeVideoPeer_Subscription};