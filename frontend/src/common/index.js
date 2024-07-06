import crypto from 'crypto-js'
import cookies from 'js-cookies'

const setDataInCookie = (key,data) => {
    const secret = import.meta.env.VITE_SECRET_KEY;
    if (typeof data != 'string') {
        data = JSON.stringify(data);
    }
    const encryptedData = crypto.AES.encrypt(data, secret).toString();
    if (encryptedData) {
        cookies.setItem(key, JSON.stringify(encryptedData));
    }
}

const getCookieData = (key,string=false) => {
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
export {setDataInCookie,getCookieData,removeCookieData}