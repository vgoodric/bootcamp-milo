export default async function placeholders(config, key) {
  const path = `${config.locale.contentRoot}/placeholders.json`;
  const resp = await fetch(path);
  const placeholders = {};
  if (!resp.ok) return placeholders;
  const json = await resp.json();

  json.data.forEach(item => {
    placeholders[item.key] = item.value;
  });
  console.log(placeholders);
  return placeholders;
}
