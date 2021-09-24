import { gql } from "@apollo/client";
import type {IMessenge} from '../../models/messenge';


const watchMessenge = gql`
    subscription watchMessenge($recipientId: Int!) {
        watchMessenge(recipientId: $recipientId) {
            text, authorId, recipientId
        }
    }
`;
export default watchMessenge;

interface watchMessenge_Subscription{
    watchMessenge: IMessenge
}
export type {watchMessenge_Subscription};