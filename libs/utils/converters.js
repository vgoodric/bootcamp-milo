export const utf8ToB64 = (str) => window.btoa(unescape(encodeURIComponent(str)));
export const b64ToUtf8 = (str) => decodeURIComponent(escape(window.atob(str)));

export function parseEncodedConfig(encodedConfig) {
  try {
    return JSON.parse(b64ToUtf8(decodeURIComponent(encodedConfig)));
  } catch (e) {
    console.log(e);
  }
  return null;
}
