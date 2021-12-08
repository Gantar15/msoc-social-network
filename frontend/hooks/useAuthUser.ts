import type { IUser } from '../models/user';
import getAuthUser, { getAuthUser_Query } from '../apollo/queries/getAuthUser';
import { useQuery } from '@apollo/client';

function useAuthUser(){
    const {data: authUser} = useQuery<getAuthUser_Query>(getAuthUser);
    return {authUser};
}
export default useAuthUser;