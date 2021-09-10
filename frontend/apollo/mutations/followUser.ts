import {gql, useMutation} from '@apollo/client';

const followUser = gql`
    mutation followUser($userId: Int!){
        followUser(userId: $userId)
    }
`;

const useFollowUser = (userId: number) => {
    const [follow] = useMutation(followUser, {
        variables: {
            userId
        }
    });

    return {followUser: follow};
};