
import type { IUser } from "../../models/user";
import { authUserVar } from "../cache";

export default function setAuthUser(user: IUser | null){
    authUserVar(user);
}