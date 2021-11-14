import {gql, useMutation} from '@apollo/client';
import getFollowers, { getFollowers_Query } from '../queries/getFollowers';
import getFollowersCount, { getFollowersCount_Query } from '../queries/getFollowersCount';
import getFollowinsCount, { getFollowinsCount_Query } from '../queries/getFollowinsCount';
import getFollowins, { getFollowins_Query } from '../queries/getFollowins';
import { IUser } from '../../models/user';
import useAuthUser from '../../hooks/useAuthUser';

const followUser = gql`
    mutation followUser($userId: Int!){
        followUser(userId: $userId){
            name, email, 
            profilePicture, id,
            followers, followins
        }
    }
`;

const useFollowUser = (userId: number) => {
    const {authUser} = useAuthUser();
    const [follow] = useMutation<{followUser: IUser}>(followUser, {
        variables: {
            userId
        },
        update(cache, data) {
            if(!data.data?.followUser) return;
            const followUser = data.data.followUser;

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
                cache.writeQuery({
                    query: getFollowers,
                    variables: {
                        limit: 5,
                        offset: 0,
                        userId
                    },
                    data: {
                        getFollowers: [...oldFollowers.getFollowers, authUser?.getAuthUser]
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
                        getFollowersCount: oldFollowersCount.getFollowersCount+1
                    }
                });
            }

            //followins edit
            const oldFollowins = cache.readQuery<getFollowins_Query>({
                query: getFollowins,
                variables: {
                    limit: 5,
                    offset: 0,
                    userId: authUser?.getAuthUser?.id
                }
            });
            if(oldFollowins?.getFollowins){
                cache.writeQuery({
                    query: getFollowins,
                    variables: {
                        limit: 5,
                        offset: 0,
                        userId: authUser?.getAuthUser?.id
                    },
                    data: {
                        getFollowins: [...oldFollowins.getFollowins, followUser]
                    }
                });
            }

            const oldFollowinsCount = cache.readQuery<getFollowinsCount_Query>({
                query: getFollowinsCount,
                variables: {
                    userId: authUser?.getAuthUser?.id
                }
            });
            if(oldFollowinsCount?.getFollowinsCount){
                cache.writeQuery({
                    query: getFollowinsCount,
                    variables: {
                        userId: authUser?.getAuthUser?.id
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