import {gql, useMutation} from '@apollo/client';
import type { IMessenge } from '../../models/messenge';
import getMessenges from '../queries/getMessenges';

const editMessenge = gql`
    mutation editMessenge($messengeId: Int!, $messenge: String, $imgs: [Upload!], $videos: [Upload!], $documents: [Upload!], $audios: [Upload!]){
        editMessenge(messengeId: $messengeId, messenge: $messenge, imgs: $imgs, videos: $videos, documents: $documents, audios: $audios){
            id,
            createdAt,
            updatedAt,
            text,
            authorId,
            recipientId,
            imgs,
            videos,
            audios,
            documents{
                filename,
                codedFilename
            }
        }
    }
`;

const useEditMessenge = (recipientId: number) => {
    const [editMessengeExecute, {data: response}] = useMutation(editMessenge);

    return {editMessenge: (messengeId: number, messenge: string|null, imgs: FileList|null, videos: FileList|null, documents: FileList|null, audios: FileList|null) => {
        editMessengeExecute({
            variables: {
                messengeId,
                messenge,
                imgs,
                videos,
                documents,
                audios
            },
            update(cache, data) {
                const newMess: IMessenge = data.data.editMessenge;
                const oldMessenges: {getMessenges: IMessenge[]} | null = cache.readQuery({
                    query: getMessenges,
                    variables: {
                        recipientId
                    }
                });

                if(oldMessenges?.getMessenges && newMess){
                    for (let i = 0; i < oldMessenges.getMessenges.length; i++) {
                        if(oldMessenges.getMessenges[i].id == newMess.id)
                            oldMessenges.getMessenges[i] = newMess;
                    }
                    cache.writeQuery({
                        query: getMessenges,
                        variables: {
                            recipientId
                        },
                        data: oldMessenges
                    });
                }
            }
        });
    }, data: response};
};
export default useEditMessenge;