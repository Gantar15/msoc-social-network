import {ApolloCache, gql, useMutation} from '@apollo/client';
import getFollowers, { getFollowers_Query } from '../queries/getFollowers';
import getFollowersCount, { getFollowersCount_Query } from '../queries/getFollowersCount';
import getFollowinsCount, { getFollowinsCount_Query } from '../queries/getFollowinsCount';
import { IUser } from '../../models/user';
import useAuthUser from '../../hooks/useAuthUser';
import getAuthUser from '../queries/getAuthUser';
import getFollowins, { getFollowins_Query } from '../queries/getFollowins';
import setAuthUser from './setAuthUser';

const followUser = gql`
    mutation followUser($userId: Int!){
        followUser(userId: $userId){
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


function addFollower(userId: number, follower: IUser, cache: ApolloCache<any>){
    const oldFollowers = cache.readQuery<getFollowers_Query>({
        query: getFollowers,
        variables: {
            limit: 5,
            offset: 0,
            userId: userId
        }
    });
    if(oldFollowers?.getFollowers){
        cache.writeQuery({
            query: getFollowers,
            variables: {
                limit: 5,
                offset: 0,
                userId: userId
            },
            data: {
                getFollowers: [...oldFollowers.getFollowers, follower]
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
                getFollowersCount: oldFollowersCount.getFollowersCount+1
            }
        });
    }
}

function addFollowin(userId: number, followin: IUser, cache: ApolloCache<any>){
    const oldFollowins = cache.readQuery<getFollowins_Query>({
        query: getFollowins,
        variables: {
            limit: 5,
            offset: 0,
            userId: userId
        }
    });
    if(oldFollowins?.getFollowins){
        cache.writeQuery({
            query: getFollowins,
            variables: {
                limit: 5,
                offset: 0,
                userId: userId
            },
            data: {
                getFollowins: [...oldFollowins.getFollowins, followin]
            }
        });
    }
}

const useFollowUser = (userId: number, profileUserId: number) => {
    const {authUser} = useAuthUser();
    const [follow] = useMutation<{followUser: IUser}>(followUser, {
        variables: {
            userId
        },
        update(cache, data) {
            if(!data.data?.followUser || !authUser?.getAuthUser) return;
            
            //edit followers when current profile are auth user profile
            if(profileUserId === authUser.getAuthUser.id)
                addFollowin(authUser.getAuthUser.id, data.data.followUser, cache);

            //followers edit
            if(userId === profileUserId)
                addFollower(userId, authUser.getAuthUser, cache);

            //followins edit
            setAuthUser({
                ...authUser.getAuthUser,
                followins: [...authUser.getAuthUser.followins, userId]
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
                        getFollowinsCount: oldFollowinsCount.getFollowinsCount+1
                    }
                });
            }
        }
    });


    return {followUser: follow};
};
export default useFollowUser;