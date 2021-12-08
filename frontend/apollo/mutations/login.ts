
import { gql, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import setAuthUser from "../setters/setAuthUser";
import setRefreshToken from "../setters/setRefreshToken";

const login = gql`
    mutation login($email: String!, $password: String!, $isSession: Boolean!){
        login(email: $email, password: $password, isSession: $isSession){
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

export const useLogin = () => {
    let [error, setError] = useState<any>();
    const [mutate, {data: loginData, loading}] = useMutation(login, {
        onError: err => setError(err)
    });
    useEffect(() => {
        if(loginData?.login){
            localStorage.setItem('accessToken', loginData.login.accessToken);
            setAuthUser(loginData.login.user);
            setRefreshToken(loginData.login.accessToken);
        }
    }, [loginData]);

    return {login: (email: string, password: string, isSession: boolean) => mutate({variables: {
        email, password, isSession
    }}), data: loginData, loading, error, setError};
};