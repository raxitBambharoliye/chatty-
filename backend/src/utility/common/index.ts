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
export const encryptData = (data: any,encodedData=false) => {
  let secret = process.env.SECRET_KEY || "chatyπ-!@#$$%%$#!@T*^";
  
  if (typeof data !== "string") {
    data = JSON.stringify(data);
  }
  let encryptedData = CryptoJS.AES.encrypt(data, secret).toString();
  if (encodedData) {
    encryptedData = encodeURIComponent(encryptedData); 
  }
    return encryptedData;
}
export const decryptData = (data:any) => {
  let secret = process.env.SECRET_KEY || "chatyπ-!@#$$%%$#!@T*^";

  if (data) {
      const bytes = CryptoJS.AES.decrypt(data, secret).toString(CryptoJS.enc.Utf8);
      console.log('bytes', bytes)
      if (typeof bytes === "string") {
          return JSON.parse(bytes);
      }
      return bytes;
  }
  return null;
}
export { setCookieData,createToken };
