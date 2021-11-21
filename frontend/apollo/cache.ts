
import { InMemoryCache, makeVar } from "@apollo/client";
import type { IUser } from "../models/user";


export const authUserVar = makeVar<IUser | null>(null);

type mergeList = {ref: string};
export default new InMemoryCache({
    typePolicies: {
        Query:{
            fields:{
                getAuthUser: {
                    read(){
                        return authUserVar();
                    }
                },
                getFollowers: {
                    merge(_: any, incoming: mergeList[]) {
                        return incoming;
                    }
                },
                getFollowins: {
                    merge(_: any, incoming: mergeList[]) {
                        return incoming;
                    }
                },
                getMessenges: {
                    merge(_: any, incoming: mergeList[]){
                        return incoming;
                    }
                }
            }
        },
    }
});