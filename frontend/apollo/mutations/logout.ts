
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import setAuthUser from "../setters/setAuthUser";
import setRefreshToken from "../setters/setRefreshToken";

const logout = gql`
    mutation logout{
        logout
    }
`;

export const useLogout = () => {
    const router = useRouter();
    const [mutate, {data: logoutData}] = useMutation(logout, {
        onError: err => {}
    });
    useEffect(() => {
        if(logoutData?.logout){
            localStorage.removeItem('accessToken');
            setAuthUser(null);
            setRefreshToken(null);
            router.push('/login');
        }
    }, [logoutData]);

    return {logout: mutate, data: logoutData};
};