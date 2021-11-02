import { gql } from "@apollo/client";


const relayICE = gql`
    mutation relayICE($targetPeer: Int!, $iceCandidate: IceCandidateInitInput!){
        relayICE(targetPeer: $targetPeer, iceCandidate: $iceCandidate)
    }
`;

export default relayICE;