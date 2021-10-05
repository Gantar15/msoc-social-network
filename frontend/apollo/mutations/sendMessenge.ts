import {gql, useMutation} from '@apollo/client';
import getMessenges from '../queries/getMessenges';

const sendMessenge = gql`
    mutation sendMessenge($recipientId: Int!, $messenge: String!){
        sendMessenge(recipientId: $recipientId, messenge: $messenge){
            id,
            text,
            createdAt,
            updatedAt,
            recipientId,
            authorId
        }
    }
`;

const useSendMessenge = (recipientId: number) => {
    const [sendMessengeExecute, {data: newMessenge}] = useMutation(sendMessenge, {
        refetchQueries: [getMessenges]
    });

    return {sendMessenge: (messenge: string) => {
        sendMessengeExecute({
            variables: {
                recipientId,
                messenge
            }
        });
    }, data: newMessenge};
};
export default useSendMessenge;