import { gql, useQuery } from "@apollo/client";


const getAuthUser = gql`
    query getAuthUser @client{
        id,
        name,
        email,
        isActivated
    }
`;

const useAuthUser = () => {
    const {data, error} = useQuery(getAuthUser);
};