import User from "models/User";

interface ISubscriptionsContext{
    authUser: User | null;
}
export type {ISubscriptionsContext};