import { gql } from "@apollo/client";


const iceCandidate = gql`
    subscription iceCandidate {
        iceCandidate {
            peerId,
            iceCandidate{
                candidate,
                sdpMLineIndex,
                sdpMid,
                usernameFragment,
            }
        }
    }
`;
export default iceCandidate;

interface iceCandidate_Subscription{
    iceCandidate: {
        peerId: number,
        iceCandidate: RTCIceCandidateInit
    }
}
export type {iceCandidate_Subscription};