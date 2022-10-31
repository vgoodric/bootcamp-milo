export const fetchData = async (url) => {
  const res = await fetch(url);
  const { ok, status, statusText } = res;
  if (!ok) {
    console.error(`${status}: ${statusText}`);
    throw new Error('res not ok!');
  }
  const results = await res.json();
  return results.data;
};

export function extractTimeFromTestId(testId) {
  let ms = new Date();
  try {
    const timeHex = testId.substring(0, 8);
    ms = parseInt(timeHex, 16) * 1000;
  } catch (err) {
    console.error(`when extracting time from testId(${testId}): ${err}`);
  }

  return ms;
}

export function convertTimeToShortDate(ms) {
  return new Date(ms).toISOString().split('T')[0].replace(/-/g, '/');
}

export function generateTestRunID() {
  // maybe use uuid or mongodb ObjectId?
  return (
    Math.floor(new Date().getTime() / 1000).toString(16) +
    'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
      Math.floor(Math.random() * 16)
        .toString(16)
        .toLowerCase()
    )
  );
}
