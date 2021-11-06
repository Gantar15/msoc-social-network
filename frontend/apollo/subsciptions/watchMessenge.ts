import { gql, useApolloClient, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import getMessenges from "../queries/getMessenges";


const watchMessenge = gql`
    subscription watchMessenge($recipientId: Int!) {
        watchMessenge(recipientId: $recipientId)
    }
`;

interface watchMessenge_Subscription{
    watchMessenge: number
}
export type {watchMessenge_Subscription};


const useWatchMessenge = (interlocutorRoom: number) => {
    const apolloClient = useApolloClient();
    const {data: newMessengeData} = useSubscription<watchMessenge_Subscription>(watchMessenge, {
        variables: {
          recipientId: interlocutorRoom
        }
      });  

    useEffect(() => {
        if(newMessengeData?.watchMessenge)
            apolloClient.refetchQueries({include: [getMessenges]});
    }, [newMessengeData]);

    return {data: newMessengeData};
};
export default useWatchMessenge;