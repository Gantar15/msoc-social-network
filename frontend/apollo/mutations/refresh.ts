
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
                profilePicture,
                followers,
                followins,
                role,
                id,
                isActivated,
                desc,
                city,
                from,
                relationship
            }
        }
    }
`;

export const useRefresh = () => {
    const {logout} = useLogout();
    const [mutate, {data: refreshData, error: refreshError, loading: refreshLoading}] = useMutation(refresh, {
        onError: err => logout()
    });
    useEffect(() => {
        if(refreshData?.refresh){
            localStorage.setItem('accessToken', refreshData.refresh.accessToken);
            setAuthUser(refreshData.refresh.user);
        }
    }, [refreshData]);

    return {refresh: mutate, data: refreshData, error: refreshError, loading: refreshLoading};
};