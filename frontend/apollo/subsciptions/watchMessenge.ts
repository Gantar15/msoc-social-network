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
        operationType: 'edit' | 'remove' | 'send'
    }
}
export type {watchMessenge_Subscription};


const useWatchMessenge = () => {
    const apolloClient = useApollo();
    const {data: newMessengeData} = useSubscription<watchMessenge_Subscription>(watchMessenge);

    useEffect(() => {
        if(newMessengeData?.watchMessenge){
            const {messenge, operationType} = newMessengeData.watchMessenge;
            switch(operationType){
                case 'edit': {
                    const newMess: IMessenge = messenge;
                    const oldMessenges: IMessenge[]|null = apolloClient.readQuery({
                        query: getMessenges
                    });

                    if(oldMessenges){
                        for (let i = 0; i < oldMessenges.length; i++) {
                            if(oldMessenges[i].id == newMess.id)
                                oldMessenges[i] = newMess;
                        }
                        apolloClient.writeQuery({
                            query: getMessenges,
                            data: {
                                getMessenges: oldMessenges
                            }
                        });
                    }
                    break;
                }

                case 'remove': {
                    const messToDel: IMessenge = messenge;
                    let oldMessenges: IMessenge[]|null = apolloClient.readQuery({
                        query: getMessenges
                    });
    
                    if(oldMessenges){
                        oldMessenges = oldMessenges.filter(el => el.id != messToDel.id);
                        apolloClient.writeQuery({
                            query: getMessenges,
                            data: {
                                getMessenges: oldMessenges
                            }
                        });
                    }
                    break;
                }

                case 'send': {
                    const newMess: IMessenge = messenge;
                    const oldMessenges: IMessenge[]|null = apolloClient.readQuery({
                        query: getMessenges
                    });
    
                    if(oldMessenges){
                        apolloClient.writeQuery({
                            query: getMessenges,
                            data: {
                                getMessenges: [...oldMessenges, newMess]
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