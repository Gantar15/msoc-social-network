import {gql, useMutation} from '@apollo/client';
import getFollowers from '../queries/getFollowers';
import client from '../client';
import getFollowersCount from '../queries/getFollowersCount';
import getFollowinsCount from '../queries/getFollowinsCount';
import getFollowins from '../queries/getFollowins';

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
    const [follow] = useMutation(followUser, {
        variables: {
            userId
        },
        update: (cache, {data}) => {
            cache.writeQuery({
                query: getFollowers,
                data: {
                    getFollowers: [data.followUser]
                },
                variables: {
                    limit: 20, offset: 0, userId
                }
            });
            client().refetchQueries({include: [getFollowers, getFollowersCount, getFollowins, getFollowinsCount]});
        }
    });


    return {followUser: follow};
};
export default useFollowUser;