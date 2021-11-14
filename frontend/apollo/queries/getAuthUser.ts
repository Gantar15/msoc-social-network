import { gql } from "@apollo/client";


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
export default getAuthUser;