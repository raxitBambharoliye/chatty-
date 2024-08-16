import { io } from "socket.io-client"
import { getCookieData } from "../common";
import { COOKIE_KEY } from "../constant";

export const getSocket = () => {
    const authToken = getCookieData(COOKIE_KEY.TOKEN,true);

    const socket = io(import.meta.env.VITE_BASE_URL, {
        auth: { token: authToken ?? "" }
    });
    return socket;
}