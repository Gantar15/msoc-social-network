import { gql } from "@apollo/client";


const getNewestInterlocutors = gql`
    query getNewestInterlocutors{
        getNewestInterlocutors{
            id,
            name,
            profilePicture,
        }
    }
`;
export default getNewestInterlocutors;

interface IInterlocutor{
    id: number;
    name: string;
    profilePicture: string;
}
interface getNewestInterlocutors_Query{
    getNewestInterlocutors: IInterlocutor[];
}
export type {getNewestInterlocutors_Query, IInterlocutor};