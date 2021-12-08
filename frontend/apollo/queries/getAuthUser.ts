import { gql } from "@apollo/client";
import { IUser } from "../../models/user";


const getAuthUser = gql`
    query {
        getAuthUser @client{
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

export interface getAuthUser_Query{
    getAuthUser: IUser|null;
}

export default getAuthUser;