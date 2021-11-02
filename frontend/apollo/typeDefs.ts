import gql from "graphql-tag";

const typeDefs = gql`
    input IceCandidateInitInput{
        candidate: String
        sdpMLineIndex: Int
        sdpMid: String
        usernameFragment: String
    }
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
`;
export default typeDefs;