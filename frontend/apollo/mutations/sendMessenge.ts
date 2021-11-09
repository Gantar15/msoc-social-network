import {gql, useMutation} from '@apollo/client';
import type { IMessenge } from '../../models/messenge';
import getMessenges from '../queries/getMessenges';

const sendMessenge = gql`
    mutation sendMessenge($recipientId: Int!, $messenge: String, $imgs: [Upload!], $videos: [Upload!], $documents: [Upload!], $audios: [Upload!]){
        sendMessenge(recipientId: $recipientId, messenge: $messenge, imgs: $imgs, videos: $videos, documents: $documents, audios: $audios){
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

const useSendMessenge = (recipientId: number) => {
    const [sendMessengeExecute, {data: newMessenge}] = useMutation(sendMessenge);

    return {sendMessenge: (messenge: string|null, imgs: FileList|null, videos: FileList|null, documents: FileList|null, audios: FileList|null) => {
        sendMessengeExecute({
            variables: {
                recipientId,
                messenge,
                imgs,
                videos,
                documents,
                audios
            },
            update(cache, data) {
                const newMess: IMessenge = data.data.sendMessenge;
                const oldMessenges: {getMessenges: IMessenge[]}|null = cache.readQuery({
                    query: getMessenges,
                    variables: {
                        recipientId
                    }
                });
                
                if(oldMessenges?.getMessenges && newMess){
                    cache.writeQuery({
                        query: getMessenges,
                        variables: {
                            recipientId
                        },
                        data: {
                            getMessenges: [...oldMessenges.getMessenges, newMess]
                        }
                    });
                }
            }
        });
    }, data: newMessenge};
};
export default useSendMessenge;