// encryption.ts
import * as CryptoJS from 'crypto-js';

// 硬编码密钥
const SECRET_KEY = '4a453159-9f80-4f22-83a7-ffe2f35cc227'; // 密钥字符串

// 加密函数
export function encryptData(data: string): string {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY); // 将密钥字符串转为 WordArray
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString(); // 返回加密后的数据
}

// 解密函数
export function decryptData(encryptedData: string): string {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY); // 将密钥字符串转为 WordArray
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8); // 返回解密后的数据
}

// 示例使用
// const originalText = 'Hello, world!';
// const encryptedText = encryptData(originalText);
// console.log('Encrypted Text:', encryptedText);

// const decryptedText = decryptData(encryptedText);
// console.log('Decrypted Text:', decryptedText);
