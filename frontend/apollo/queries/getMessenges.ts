import { useEffect } from 'react';
import {gql, useLazyQuery} from '@apollo/client';
import type {QueryLazyOptions} from '@apollo/client';
import { IMessenge } from "../../models/messenge";
import { useApollo } from '../client';

const getMessenges = gql`
    query getMessenges($recipientId: Int!){
        getMessenges(recipientId: $recipientId){
            id,
            text,
            createdAt,
            updatedAt,
            recipientId,
            authorId,
            audios,
            videos,
            imgs,
            documents{
                filename,
                codedFilename
            }
        }
    }
`;

export default getMessenges;

interface getMessenges_Query{
    getMessenges: IMessenge[]
}
export type {getMessenges_Query};

const useGetMessenges = () => {
    const apolloClient = useApollo();
    const [getMessengesExecute, {data: getMessengesData, loading: getMessengesLoading}] = useLazyQuery<getMessenges_Query>(getMessenges);
    let recipientId: number;

    useEffect(() => {
        if(getMessengesData?.getMessenges){
                apolloClient.writeQuery({
                    query: getMessenges,
                    variables: {
                        recipientId
                    },
                    data: getMessengesData
                });
        }
    }, [getMessengesData]);

    const modGetMessengesExecute = (options?: QueryLazyOptions<{recipientId: number}>) => {
        if(options?.variables){
            recipientId = options.variables.recipientId;
        }
        getMessengesExecute(options);
    };

    return {getMessengesExecute: modGetMessengesExecute, getMessengesData, getMessengesLoading};
};
export {useGetMessenges};