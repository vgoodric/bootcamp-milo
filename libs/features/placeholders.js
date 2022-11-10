function findPlaceholder(placeholders, key) {
  return placeholders[key] || key.replaceAll('-', ' ');
}

async function fetchPlaceholders(config) {
  const path = `${config.locale.contentRoot}/placeholders.json`;
  const resp = await fetch(path);
  const placeholders = {};
  const json = resp.ok ? await resp.json() : { data: [] };
  json.data.forEach(item => {
    placeholders[item.key] = item.value;
  });
  return placeholders;
}

export async function regExReplace(config, regex, html) {
  const placeholders = await fetchPlaceholders(config);
  return html.replaceAll(regex, (_, key) => {
    return findPlaceholder(placeholders, key);
  });
}

export async function keyReplace(key, config) {
  const placeholders = await fetchPlaceholders(config);
  return findPlaceholder(placeholders, key);
}
