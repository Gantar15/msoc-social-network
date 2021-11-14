import {gql, useMutation} from '@apollo/client';
import useAuthUser from '../../hooks/useAuthUser';
import getFollowers, {getFollowers_Query} from '../queries/getFollowers';
import getFollowersCount, {getFollowersCount_Query} from '../queries/getFollowersCount';
import getFollowins, { getFollowins_Query } from '../queries/getFollowins';
import getFollowinsCount, { getFollowinsCount_Query } from '../queries/getFollowinsCount';

const unfollowUser = gql`
    mutation unfollowUser($userId: Int!){
        unfollowUser(userId: $userId){
            id
        }
    }
`;

const useUnfollowUser = (userId: number) => {
    const {authUser} = useAuthUser();
    const [unfollow] = useMutation(unfollowUser, {
        variables: {
            userId
        },
        update: (cache) => {
            //followers edit
            const oldFollowers = cache.readQuery<getFollowers_Query>({
                query: getFollowers,
                variables: {
                    limit: 5,
                    offset: 0,
                    userId
                }
            });
            if(oldFollowers?.getFollowers){
                const followers = oldFollowers.getFollowers.filter(follower => follower.id !== authUser!.getAuthUser?.id);
                cache.writeQuery({
                    query: getFollowers,
                    variables: {
                        limit: 5,
                        offset: 0,
                        userId
                    },
                    data: {
                        getFollowers: followers
                    }
                });
            }

            const oldFollowersCount = cache.readQuery<getFollowersCount_Query>({
                query: getFollowersCount,
                variables: {
                    userId
                }
            });
            if(oldFollowersCount?.getFollowersCount){
                cache.writeQuery({
                    query: getFollowersCount,
                    variables: {
                        userId
                    },
                    data: {
                        getFollowersCount: oldFollowersCount.getFollowersCount-1
                    }
                });
            }

            //followins edit
            const oldFollowins = cache.readQuery<getFollowins_Query>({
                query: getFollowins,
                variables: {
                    limit: 5,
                    offset: 0,
                    userId: authUser!.getAuthUser?.id
                }
            });
            if(oldFollowins?.getFollowins){
                const followins = oldFollowins.getFollowins.filter(followin => followin.id != userId);
                cache.writeQuery({
                    query: getFollowins,
                    variables: {
                        limit: 5,
                        offset: 0,
                        userId: authUser!.getAuthUser?.id
                    },
                    data: {
                        getFollowins: followins
                    }
                });
            }

            const oldFollowinsCount = cache.readQuery<getFollowinsCount_Query>({
                query: getFollowinsCount,
                variables: {
                    userId: authUser!.getAuthUser?.id
                }
            });
            if(oldFollowinsCount?.getFollowinsCount){
                cache.writeQuery({
                    query: getFollowinsCount,
                    variables: {
                        userId: authUser!.getAuthUser?.id
                    },
                    data: {
                        getFollowinsCount: oldFollowinsCount.getFollowinsCount-1
                    }
                });
            }
        }
    });

    return {unfollowUser: unfollow};
};

export default useUnfollowUser;