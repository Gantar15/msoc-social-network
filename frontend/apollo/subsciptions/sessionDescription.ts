import { gql } from "@apollo/client";


const sessionDescription = gql`
    subscription sessionDescription {
        sessionDescription {
            peerId,
            sessionDescription{
                sdp, type
            }
        }
    }
`;
export default sessionDescription;

interface sessionDescription_Subscription{
    sessionDescription: {
        peerId: number,
        sessionDescription: RTCSessionDescriptionInit
    }
}
export type {sessionDescription_Subscription};