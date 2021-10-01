import {gql} from '@apollo/client';
import { IMessenge } from "../../models/messenge";

const getMessenges = gql`
    query getMessenges($recipientId: Int!){
        getMessenges(recipientId: $recipientId){
            id,
            text,
            createdAt,
            updatedAt,
            recipientId,
            authorId
        }
    }
`;

export default getMessenges;

interface getMessenges_Query{
    getMessenges: IMessenge[]
}
export type {getMessenges_Query};