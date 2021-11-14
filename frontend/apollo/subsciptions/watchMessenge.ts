import { gql, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import type { IMessenge } from "../../models/messenge";
import {useApollo} from '../client';
import getMessenges from "../queries/getMessenges";


const watchMessenge = gql`
    subscription watchMessenge {
        watchMessenge{
            operationType,
            messenge{
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
    }
`;

interface watchMessenge_Subscription{
    watchMessenge: {
        messenge: IMessenge,
        operationType: 'MESSENGE_SEND' | 'MESSENGE_REMOVE' | 'MESSENGE_EDIT'
    }
}
export type {watchMessenge_Subscription};


const useWatchMessenge = (recipientId: number) => {
    const apolloClient = useApollo();
    const {data: newMessengeData} = useSubscription<watchMessenge_Subscription>(watchMessenge);

    useEffect(() => {
        if(newMessengeData?.watchMessenge){
            const {messenge, operationType} = newMessengeData.watchMessenge;
            switch(operationType){
                case 'MESSENGE_EDIT': {
                    const newMess: IMessenge = messenge;
                    const oldMessenges: {getMessenges: IMessenge[]} | null = apolloClient.readQuery({
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
                        apolloClient.writeQuery({
                            query: getMessenges,
                            variables: {
                                recipientId
                            },
                            data: oldMessenges
                        });
                    }
                    break;
                }

                case 'MESSENGE_REMOVE': {
                    const messToDel: IMessenge = messenge;
                    let oldMessenges: {getMessenges: IMessenge[]} | null = apolloClient.readQuery({
                        query: getMessenges,
                        variables: {
                            recipientId
                        }
                    });
                    
                    if(oldMessenges?.getMessenges && messToDel){
                        const updatedMessenges = oldMessenges.getMessenges.filter(el => el.id != messToDel.id);
                        apolloClient.writeQuery({
                            query: getMessenges,
                            variables: {
                                recipientId
                            },
                            data: {
                                getMessenges: updatedMessenges
                            }
                        });
                    }
                    break;
                }

                case 'MESSENGE_SEND': {
                    const newMess: IMessenge = messenge;
                    const oldMessenges: {getMessenges: IMessenge[]}|null = apolloClient.readQuery({
                        query: getMessenges,
                        variables: {
                            recipientId
                        }
                    });
                    
                    if(oldMessenges?.getMessenges && newMess){
                        apolloClient.writeQuery({
                            query: getMessenges,
                            variables: {
                                recipientId
                            },
                            data: {
                                getMessenges: [...oldMessenges.getMessenges, newMess]
                            }
                        });
                    }
                    break;
                }

            }
        }
    }, [newMessengeData]);

    return {data: newMessengeData};
};
export default useWatchMessenge;