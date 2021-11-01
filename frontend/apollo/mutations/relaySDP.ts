import { gql } from "@apollo/client";


const relaySDP = gql`
    enum RTCSdpType{
        answer
        offer
        pranswer
        rollback
    }
    input SessionDescriptionInitInput{
        sdp: String
        type: RTCSdpType!
    }
    mutation relaySDP($targetPeer: Int!, $sessionDescription: SessionDescriptionInitInput!){
        relaySDP(targetPeer: $targetPeer, sessionDescription: $sessionDescription)
    }
`;

export default relaySDP;