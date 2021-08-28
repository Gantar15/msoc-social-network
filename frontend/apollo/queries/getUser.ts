import { gql } from "@apollo/client";


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