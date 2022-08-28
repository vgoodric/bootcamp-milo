import { getConfig } from '../utils/utils.js';

const getPlaceholders = (() => {
  let data;
  return async (config) => {
    if (!data) {
      const resp = await fetch(`${config.locale.prefix}/placeholders.json`);
      if (!resp.ok) return null;
      const json = await resp.json();
      data = json.data;
    }
    return data;
  };
})();

export default async function init(el = document) {
  const config = getConfig();
  const data = await getPlaceholders(config);
  console.log(data);
}
