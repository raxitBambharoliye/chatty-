import crypto from 'crypto-js'
import cookies from 'js-cookies'
import { COOKIE_KEY } from '../constant';

const setDataInCookie = (key, data) => {
    const secret = import.meta.env.VITE_SECRET_KEY;
    if (typeof data != 'string') {
        data = JSON.stringify(data);
    }
    const encryptedData = crypto.AES.encrypt(data, secret).toString();
    if (encryptedData) {
        cookies.setItem(key, JSON.stringify(encryptedData));
    }
}

const getCookieData = (key, string = false) => {
    const secret = import.meta.env.VITE_SECRET_KEY;
    const encryptedToken = cookies.getItem(key);
    if (encryptedToken) {
        const bytes = crypto.AES.decrypt(JSON.parse(encryptedToken), secret).toString(crypto.enc.Utf8);
        if (!string) {
            return JSON.parse(bytes);
        }
        return bytes;
    }
    return null;
}

const removeCookieData = (key) => {
    cookies.removeItem(key);
}
const clearAllCookiesData = () => {
    const allCookies = COOKIE_KEY; 
    Object.values(allCookies).forEach((cookieName) => {
        cookies.removeItem(cookieName);
    });
}

export const cutString = (str, limit)=>{
    if (str.length > limit) {
        return str.substring(0, limit) + '...';
    }
    return str;
}
export { setDataInCookie, getCookieData, removeCookieData, clearAllCookiesData }