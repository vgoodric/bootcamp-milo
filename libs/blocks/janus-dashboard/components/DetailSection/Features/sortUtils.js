// sort by a string field
export function sortByStringField(a, b, extractFieldFunc) {
  const fieldA = extractFieldFunc(a);
  const fieldB = extractFieldFunc(b);
  return fieldA.localeCompare(fieldB);
}

export const SortingConfigs = {
  DEFAULT: { sortingFunc: undefined, name: 'Default' },
  STATUS_DESC: {
    sortingFunc: (a, b) => sortByStringField(a, b, (o) => o?.status),
    name: 'Status: Low to High',
  },
  STATUS_ASC: {
    sortingFunc: (a, b) => sortByStringField(b, a, (o) => o?.status),
    name: 'Status: High to Low',
  },
  ENV_DESC: {
    sortingFunc: (a, b) => sortByStringField(a, b, (o) => o?.env),
    name: 'Env: Low to High',
  },
  ENV_ASC: {
    sortingFunc: (a, b) => sortByStringField(b, a, (o) => o?.env),
    name: 'Env: High to Low',
  },
};
