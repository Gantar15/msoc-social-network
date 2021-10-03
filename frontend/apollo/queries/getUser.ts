import { gql } from "@apollo/client";
import { IUser } from "../../models/user";


const getUser = gql`
    query getUser($userId: Int!){
        getUser(userId: $userId){
            name,
            email,
            profilePicture,
            followers,
            followins,
            role,
            id,
            isActivated,
            desc,
            city,
            from,
            relationship
        }
    }
`;
export default getUser;

interface getUser_Query{
    getUser: IUser;
}
export type {getUser_Query};