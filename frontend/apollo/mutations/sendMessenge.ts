import {gql, useMutation} from '@apollo/client';
import getMessenges from '../queries/getMessenges';

const sendMessenge = gql`
    mutation sendMessenge($recipientId: Int!, $messenge: String, $imgs: [Upload!], $videos: [Upload!], $documents: [Upload!], $audios: [Upload!]){
        sendMessenge(recipientId: $recipientId, messenge: $messenge, imgs: $imgs, videos: $videos, documents: $documents, audios: $audios)
    }
`;

const useSendMessenge = (recipientId: number) => {
    const [sendMessengeExecute, {data: newMessenge}] = useMutation(sendMessenge, {
        refetchQueries: [getMessenges]
    });

    return {sendMessenge: (messenge: string|null, imgs: FileList|null, videos: FileList|null, documents: FileList|null, audios: FileList|null) => {
        sendMessengeExecute({
            variables: {
                recipientId,
                messenge,
                imgs,
                videos,
                documents,
                audios
            }
        });
    }, data: newMessenge};
};
export default useSendMessenge;