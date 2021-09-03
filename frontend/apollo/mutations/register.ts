
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const register = gql`
    mutation register($email: String!, $password: String!, $repeatPassword: String!, $name: String!){
        register(email: $email, password: $password, repeatPassword: $repeatPassword, name: $name){
            name, email
        }
    }
`;

export const useRegister = (email: string, password: string, repeatPassword: string, name: string) => {
    let [error, setError] = useState<any>();
    const [mutate, {data: registerData, loading}] = useMutation(register, {
        variables: {
            email, password, repeatPassword, name
        },
        onError: err => setError(err)
    });

    return {register: mutate, data: registerData, loading, error, setError};
};