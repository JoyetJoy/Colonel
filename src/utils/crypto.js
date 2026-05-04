import CryptoJS from "crypto-js";

const SECRET_KEY = "role-secret-key";

// Encrypt data
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
};

// Decrypt data
export const decryptData = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted ? JSON.parse(decrypted) : null;
  } catch (error) {
    return null;
  }
};

// Must match Flutter
const SALT = CryptoJS.lib.WordArray.create(
  [0x4a54321b, 0x16c173b5],
  8
);

// ============ ENCRYPT ============
export function encryptUrl(data) {
  const jsonString = JSON.stringify(data);

  const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY, {
    salt: SALT,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const base64 = encrypted.toString();

  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// ============ DECRYPT ============
export function decryptUrl(input) {
  const base64 = input
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const decrypted = CryptoJS.AES.decrypt(base64, SECRET_KEY);

  const result = decrypted.toString(CryptoJS.enc.Utf8);

  return result;
}

export const formatIndianNumber = (num) => {
  return Number(num || 0).toLocaleString("en-IN");
};