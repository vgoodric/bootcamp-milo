export const SortingTypes = {
  DEFAULT: `DEFAULT`,
  STATUS_DESC: `STATUS_DESC`,
  STATUS_ASC: `STATUS_ASC`,
  ENV_DESC: `ENV_DESC`,
  ENV_ASC: `ENV_ASC`,
};

export const SortingConfigs = {
  DEFAULT: { sortingFunc: undefined, name: `Default` },
  STATUS_DESC: {
    sortingFunc: (a, b) => sortByStringField(a, b, (o) => o?.status),
    name: `Status: Low to High`,
  },
  STATUS_ASC: {
    sortingFunc: (a, b) => sortByStringField(b, a, (o) => o?.status),
    name: `Status: High to Low`,
  },
  ENV_DESC: {
    sortingFunc: (a, b) => sortByStringField(a, b, (o) => o?.env),
    name: `Env: Low to High`,
  },
  ENV_ASC: {
    sortingFunc: (a, b) => sortByStringField(b, a, (o) => o?.env),
    name: `Env: High to Low`,
  },
};

// sort by a string field
export function sortByStringField(a, b, extractFieldFunc) {
  const fieldA = extractFieldFunc(a);
  const fieldB = extractFieldFunc(b);
  return fieldA.localeCompare(fieldB);
}

export const SortingFuncs = {
  [SortingTypes.DEFAULT]: undefined,
  [SortingTypes.STATUS_ASC]: (a, b) =>
    sortByStringField(a, b, (o) => o?.status),
  [SortingTypes.STATUS_DESC]: (a, b) =>
    sortByStringField(b, a, (o) => o?.status),
  [SortingTypes.ENV_ASC]: (a, b) => sortByStringField(a, b, (o) => o?.env),
  [SortingTypes.ENV_DESC]: (a, b) => sortByStringField(b, a, (o) => o?.env),
};

export const SortingNames = {
  [SortingTypes.DEFAULT]: `Default`,
  [SortingTypes.STATUS_ASC]: `Status: Low to High`,
  [SortingTypes.STATUS_DESC]: `Status: High to Low`,
  [SortingTypes.ENV_ASC]: `Env: Low to High`,
  [SortingTypes.ENV_DESC]: `Env: High to Low`,
};
