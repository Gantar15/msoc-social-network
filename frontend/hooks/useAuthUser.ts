import type { IUser } from '../models/user';
import getAuthUser from '../apollo/queries/getAuthUser';
import { useQuery } from '@apollo/client';

function useAuthUser(){
    const {data: authUser} = useQuery<{getAuthUser: IUser|null}>(getAuthUser);
    return {authUser};
}
export default useAuthUser;