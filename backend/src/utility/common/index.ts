import CryptoJS from 'crypto-js';
// import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
const setCookieData = ( data: any) => {
  const secret = process.env.COOKIE_SECRET_KEY || 'chatyπ-!@#$$%%$#!@T*^%*^&}{}';
  let stringifiedData: string;

  if (typeof data !== 'string') {
    stringifiedData = JSON.stringify(data);
  } else {
    stringifiedData = data;
  }

  const encryptedData = CryptoJS.AES.encrypt(stringifiedData, secret).toString();
    return encryptedData;
};

const createToken = (userId: string, email: string) => {
    let secret = process.env.JWT_SECRET || "";
    let token = jwt.sign({ userId, email}, secret, {
        expiresIn: 60 * 60 * 24,
    });
    return token;
}

export { setCookieData,createToken };
