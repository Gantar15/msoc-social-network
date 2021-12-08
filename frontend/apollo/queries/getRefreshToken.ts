import {gql} from '@apollo/client';

const getRefreshToken = gql`
    query {
        getRefreshToken @client
    }
`;

export interface getRefreshToken_Query{
    getRefreshToken: string|null;
}

export default getRefreshToken;