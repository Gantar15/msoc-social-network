import {gql, useMutation} from '@apollo/client';
import client from '../client';
import getFollowers, {getFollowers_Query} from '../queries/getFollowers';
import getFollowersCount from '../queries/getFollowersCount';
import getFollowinsCount from '../queries/getFollowinsCount';
import getFollowins from '../queries/getFollowins';

const unfollowUser = gql`
    mutation unfollowUser($userId: Int!){
        unfollowUser(userId: $userId){
            id
        }
    }
`;

const useUnfollowUser = (userId: number) => {
    const [unfollow] = useMutation(unfollowUser, {
        variables: {
            userId
        },
        update: (cache) => {
            const oldFollowers = cache.readQuery<getFollowers_Query>({
                query: getFollowers,
                variables: {userId, offset: 0, limit: 20}
            });
            // if(oldFollowers){
            //     const followers = oldFollowers.getFollowers.filter((follower: any) => follower.id != userId);
            //     cache.writeQuery({
            //         query: getFollowers,
            //         data: {getFollowers: followers},
            //         variables: {
            //             limit: 20, offset: 0, userId
            //         }
            //     });
            // }
            client().refetchQueries({include: [getFollowers, getFollowersCount, getFollowins, getFollowinsCount]});
        }
    });

    return {unfollowUser: unfollow};
};

export default useUnfollowUser;