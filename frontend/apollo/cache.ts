
import { InMemoryCache, makeVar } from "@apollo/client";
import { IAuthUser } from "../models/user";


export const authUserVar = makeVar<IAuthUser | null>(null);

export default new InMemoryCache({
    typePolicies: {
        Query:{
            fields:{
                getAuthUser: {
                    read(){
                        return authUserVar();
                    }
                }
            }
        }
    }
});