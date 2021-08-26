
import { IAuthUser } from "../../models/user";
import { authUserVar } from "../cache";

export default function setAuthUser(user: IAuthUser | null){
    authUserVar(user);
}