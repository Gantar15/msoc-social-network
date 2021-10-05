import {gql, useMutation} from '@apollo/client';
import getFollowers from '../queries/getFollowers';
import {useApollo} from '../client';
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
    const client = useApollo();
    const [follow] = useMutation(followUser, {
        variables: {
            userId
        },
        update: async () => {
            client.refetchQueries({include: [getFollowers, getFollowersCount, getFollowins, getFollowinsCount]});
        }
    });


    return {followUser: follow};
};
export default useFollowUser;