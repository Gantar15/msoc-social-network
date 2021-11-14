
import { InMemoryCache, makeVar } from "@apollo/client";
import type { IUser } from "../models/user";


export const authUserVar = makeVar<IUser | null>(null);

export default new InMemoryCache({
    typePolicies: {
        Query:{
            fields:{
                getAuthUser: {
                    read(){
                        return authUserVar();
                    }
                },
                // getFollowers: {
                //     merge(existing = [], incoming: any) {
                //         return { ...existing, ...incoming };
                //     }
                // },
                // getFollowins: {
                //     merge(existing = [], incoming: any) {
                //         return { ...existing, ...incoming };
                //     }
                // }
            }
        }
    }
});