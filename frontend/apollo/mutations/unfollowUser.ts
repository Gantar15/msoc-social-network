import {ApolloCache, gql, useMutation} from '@apollo/client';
import useAuthUser from '../../hooks/useAuthUser';
import getAuthUser from '../queries/getAuthUser';
import getFollowers, {getFollowers_Query} from '../queries/getFollowers';
import getFollowersCount, {getFollowersCount_Query} from '../queries/getFollowersCount';
import getFollowins, { getFollowins_Query } from '../queries/getFollowins';
import getFollowinsCount, { getFollowinsCount_Query } from '../queries/getFollowinsCount';
import setAuthUser from '../setters/setAuthUser';

const unfollowUser = gql`
    mutation unfollowUser($userId: Int!){
        unfollowUser(userId: $userId){
            id
        }
    }
`;


function removeFollower(userId: number, followerId: number, cache: ApolloCache<any>){
    const oldFollowers = cache.readQuery<getFollowers_Query>({
        query: getFollowers,
        variables: {
            limit: 5,
            offset: 0,
            userId: userId
        }
    });
    if(oldFollowers?.getFollowers){
        const followers = oldFollowers.getFollowers.filter(follower => follower.id != followerId);
        cache.writeQuery({
            query: getFollowers,
            variables: {
                limit: 5,
                offset: 0,
                userId: userId
            },
            data: {
                getFollowers: followers
            }
        });
    }

    const oldFollowersCount = cache.readQuery<getFollowersCount_Query>({
        query: getFollowersCount,
        variables: {
            userId: userId
        }
    });
    if(oldFollowersCount){
        cache.writeQuery({
            query: getFollowersCount,
            variables: {
                userId: userId
            },
            data: {
                getFollowersCount: oldFollowersCount.getFollowersCount-1
            }
        });
    }
}

function removeFollowin(userId: number, followinId: number, cache: ApolloCache<any>){
    const oldFollowins = cache.readQuery<getFollowins_Query>({
        query: getFollowins,
        variables: {
            limit: 5,
            offset: 0,
            userId: userId
        }
    });

    if(oldFollowins?.getFollowins){
        const newFollowins = oldFollowins.getFollowins.filter(({id}) => id != followinId);
        cache.writeQuery({
            query: getFollowins,
            variables: {
                limit: 5,
                offset: 0,
                userId: userId
            },
            data: {
                getFollowins: newFollowins
            }
        });
    }
}

const useUnfollowUser = (userId: number, profileUserId: number) => {
    const {authUser} = useAuthUser();
    const [unfollow] = useMutation(unfollowUser, {
        variables: {
            userId
        },
        update: (cache) => {
            if(!authUser?.getAuthUser) return;

            //edit followers when current profile are auth user profile
            if(profileUserId === authUser.getAuthUser.id)
            removeFollowin(authUser.getAuthUser.id, userId, cache);

            //followers edit
            if(userId === profileUserId){
                removeFollower(userId, authUser.getAuthUser.id, cache);
            }

            //followins edit
            const newFollowins = authUser.getAuthUser.followins.filter(followinId => followinId != userId);
            setAuthUser({
                ...authUser.getAuthUser,
                followins: newFollowins
            });
            const oldFollowinsCount = cache.readQuery<getFollowinsCount_Query>({
                query: getFollowinsCount,
                variables: {
                    userId: authUser.getAuthUser.id
                }
            });
            if(oldFollowinsCount){
                cache.writeQuery({
                    query: getFollowinsCount,
                    variables: {
                        userId: authUser.getAuthUser.id
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