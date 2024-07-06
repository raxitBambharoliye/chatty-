import axios from "axios";
import { getCookieData } from "../common";
import { COOKIE_KEY } from "../constant";



const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
})

axiosClient.interceptors.request.use(
    (config) => {
        const token=getCookieData(COOKIE_KEY.TOKEN,true);
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    }
)



export { axiosClient as AxiosCLI };