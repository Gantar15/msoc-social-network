import { gql } from "@apollo/client";
import { IMessenge } from "../../models/messenge";


const getNewestMessenges = gql`
    query getNewestMessenges{
        getNewestMessenges{
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
export default getNewestMessenges;

interface getNewestMessenges_Query{
    getNewestMessenges: IMessenge[]
}
export type {getNewestMessenges_Query};