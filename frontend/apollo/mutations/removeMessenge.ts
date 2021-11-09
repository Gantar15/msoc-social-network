import {gql, useMutation} from '@apollo/client';
import type { IMessenge } from '../../models/messenge';
import getMessenges from '../queries/getMessenges';

const removeMessenge = gql`
    mutation removeMessenge($messengeId: Int!, $clientInvisibility: Boolean!){
        removeMessenge(messengeId: $messengeId, clientInvisibility: $clientInvisibility){
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

const useRemoveMessenge = (recipientId: number) => {
    const [removeMessengeExecute, {data: response}] = useMutation(removeMessenge);

    return {removeMessenge: (messengeId: number, clientInvisibility: boolean) => {
        removeMessengeExecute({
            variables: {
                messengeId,
                clientInvisibility
            },
            update(cache, data) {
                const messToDel: IMessenge = data.data.removeMessenge;
                let oldMessenges: {getMessenges: IMessenge[]} | null = cache.readQuery({
                    query: getMessenges,
                    variables: {
                        recipientId
                    }
                });
                
                if(oldMessenges?.getMessenges && messToDel){
                    const updatedMessenges = oldMessenges.getMessenges.filter(el => el.id != messToDel.id);
                    cache.writeQuery({
                        query: getMessenges,
                        variables: {
                            recipientId
                        },
                        data: {
                            getMessenges: updatedMessenges
                        }
                    });
                }
            }
        });
    }, data: response};
};
export default useRemoveMessenge;