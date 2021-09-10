import {gql, useMutation} from '@apollo/client';

const unfollowUser = gql`
    mutation unfollowUser($userId: Int!){
        unfollowUser(userId: $userId)
    }
`;

const useUnfollowUser = (userId: number) => {
    const [unfollow] = useMutation(unfollowUser, {
        variables: {
            userId
        }
    });

    return {unfollowUser: unfollow};
};

export default useUnfollowUser;