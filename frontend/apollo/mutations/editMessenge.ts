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

const useEditMessenge = () => {
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
                const oldMessenges: IMessenge[]|null = cache.readQuery({
                    query: getMessenges
                });

                if(oldMessenges){
                    for (let i = 0; i < oldMessenges.length; i++) {
                        if(oldMessenges[i].id == newMess.id)
                            oldMessenges[i] = newMess;
                    }
                    cache.writeQuery({
                        query: getMessenges,
                        data: {
                            getMessenges: oldMessenges
                        }
                    });
                }
            }
        });
    }, data: response};
};
export default useEditMessenge;