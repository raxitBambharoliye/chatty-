import axios from "axios";
import { getCookieData, removeCookieData } from "../common";
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
axiosClient.interceptors.response.use((response) => {
    if (response.status == 1000) {
        removeCookieData(COOKIE_KEY.USER);
        removeCookieData(COOKIE_KEY.TOKEN);
    } else {
        return response;
    }
})


export { axiosClient as AxiosCLI };