import {gql, useMutation} from '@apollo/client';
import getMessenges from '../queries/getMessenges';

const removeMessenge = gql`
    mutation removeMessenge($messengeId: Int!, $clientInvisibility: Boolean!){
        removeMessenge(messengeId: $messengeId, clientInvisibility: $clientInvisibility)
    }
`;

const useRemoveMessenge = () => {
    const [removeMessengeExecute, {data: response}] = useMutation(removeMessenge, {
        refetchQueries: [getMessenges]
    });

    return {removeMessenge: (messengeId: number, clientInvisibility: boolean) => {
        removeMessengeExecute({
            variables: {
                messengeId,
                clientInvisibility
            }
        });
    }, data: response};
};
export default useRemoveMessenge;