import { gql } from "@apollo/client";
import { IMessenge } from "../../models/messenge";


const getNewestMessenges = gql`
    query getNewestMessenges{
        getNewestMessenges{
            id,
            createdAt,
            text,
            createdAt,
            updatedAt
        }
    }
`;
export default getNewestMessenges;

interface getNewestMessenges_Query{
    getNewestMessenges: IMessenge[]
}
export type {getNewestMessenges_Query};