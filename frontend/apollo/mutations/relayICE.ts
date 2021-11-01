import { gql } from "@apollo/client";


const relayICE = gql`
    input IceCandidateInitInput{
        candidate: String
        sdpMLineIndex: Int
        sdpMid: String
        usernameFragment: String
    }
    mutation relayICE($targetPeer: Int!, $iceCandidate: IceCandidateInitInput!){
        relayICE(targetPeer: $targetPeer, iceCandidate: $iceCandidate)
    }
`;

export default relayICE;