import {gql} from '@apollo/client';
import { IMessenge } from "../../models/messenge";

const getMessenges = gql`
    query getMessenges($recipientId: Int!, $refreshToken: String){
        getMessenges(recipientId: $recipientId, refreshToken: $refreshToken){
            id,
            text,
            createdAt,
            updatedAt,
            recipientId,
            authorId,
            audios,
            videos,
            imgs
        }
    }
`;

export default getMessenges;

interface getMessenges_Query{
    getMessenges: IMessenge[]
}
export type {getMessenges_Query};