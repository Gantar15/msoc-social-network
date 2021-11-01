import { gql } from "@apollo/client";


const addVideoPeer = gql`
    subscription addVideoPeer {
        addVideoPeer {
            createOffer,
            peerId
        }
    }
`;
export default addVideoPeer;

interface addVideoPeer_Subscription{
    addVideoPeer: {
        createOffer: boolean,
        peerId: number
    }
}
export type {addVideoPeer_Subscription};