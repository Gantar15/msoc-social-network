import { gql } from "@apollo/client";


const getAuthUser = gql`
    query {
        getAuthUser @client{
            id,
            name,
            email,
            isActivated
        }
    }
`;
export default getAuthUser;