import { gql } from "@apollo/client";


const watchMessenge = gql`
    subscription watchMessenge($recipientId: Int!) {
        watchMessenge(recipientId: $recipientId)
    }
`;
export default watchMessenge;

interface watchMessenge_Subscription{
    watchMessenge: number
}
export type {watchMessenge_Subscription};