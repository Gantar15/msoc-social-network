
import { gql, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import setAuthUser from "./setAuthUser";

const login = gql`
    mutation login($email: String!, $password: String!){
        login(email: $email, password: $password){
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

export const useLogin = (email: string, password: string) => {
    let [error, setError] = useState<any>();
    const [mutate, {data: loginData, loading}] = useMutation(login, {
        variables: {
            email, password
        },
        onError: err => setError(err)
    });
    useEffect(() => {
        if(loginData?.login){
            localStorage.setItem('accessToken', loginData.login.accessToken);
            setAuthUser(loginData.login.user);
        }
    }, [loginData]);

    return {login: mutate, data: loginData, loading, error, setError};
};