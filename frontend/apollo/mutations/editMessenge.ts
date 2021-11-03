import {gql, useMutation} from '@apollo/client';
import getMessenges from '../queries/getMessenges';

const editMessenge = gql`
    mutation editMessenge($messengeId: Int!, $messenge: String, $imgs: [Upload!], $videos: [Upload!], $documents: [Upload!], $audios: [Upload!]){
        editMessenge(messengeId: $messengeId, messenge: $messenge, imgs: $imgs, videos: $videos, documents: $documents, audios: $audios)
    }
`;

const useEditMessenge = () => {
    const [editMessengeExecute, {data: response}] = useMutation(editMessenge, {
        refetchQueries: [getMessenges]
    });

    return {editMessenge: (messengeId: number, messenge: string|null, imgs: FileList|null, videos: FileList|null, documents: FileList|null, audios: FileList|null) => {
        editMessengeExecute({
            variables: {
                messengeId,
                messenge,
                imgs,
                videos,
                documents,
                audios
            }
        });
    }, data: response};
};
export default useEditMessenge;