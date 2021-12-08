import { refreshTokenVar } from "../cache";

export default function setRefreshToken(token: string | null){
    refreshTokenVar(token);
}