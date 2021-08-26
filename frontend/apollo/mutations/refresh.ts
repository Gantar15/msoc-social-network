
import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import {useLogout} from './logout';
import setAuthUser from "./setAuthUser";

const refresh = gql`
    mutation refresh{
        refresh{
            accessToken,
            user{
                name,
                email,
                id,
                isActivated
            }
        }
    }
`;

export const useRefresh = () => {
    const {logout} = useLogout();
    const [mutate, {data: refreshData}] = useMutation(refresh, {
        onError: err => logout()
    });
    useEffect(() => {
        if(refreshData?.logout){
            localStorage.setItem('accessToken', refreshData.refresh.accessToken);
            setAuthUser(refreshData.refresh.user);
        }
    }, [refreshData]);

    return {refresh: mutate, data: refreshData};
};