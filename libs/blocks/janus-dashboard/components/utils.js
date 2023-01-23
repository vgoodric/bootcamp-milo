import { EXPECTED, envs } from './constants.js';

export function filterByTeam(flattened, team) {
  if (!team) return flattened;
  return flattened.filter((test) => test.search.team === team);
}

export function filterByFeature(flattened, feature) {
  if (!feature) return flattened;
  return flattened.filter((test) => test.search.feature === feature);
}

export function filterByStatus(flattened, status) {
  if (!status) return flattened;
  return flattened.filter((test) => test.search.status === status);
}

export const colorMap = {
  failed: 'red',
  passed: 'green',
  flaky: 'yellow',
  total: 'blue',
};

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
