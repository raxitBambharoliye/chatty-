import axios from "axios";



const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
})

axiosClient.interceptors.request.use(
    (config) => {
        const token="test";
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    }
)



export { axiosClient as AxiosCLI };