import { gql } from "@apollo/client";


const relaySDP = gql`
    mutation relaySDP($targetPeer: Int!, $sessionDescription: SessionDescriptionInitInput!){
        relaySDP(targetPeer: $targetPeer, sessionDescription: $sessionDescription)
    }
`;

export default relaySDP;