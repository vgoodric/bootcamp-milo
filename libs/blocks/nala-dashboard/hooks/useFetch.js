import { useState, useEffect } from '../../../deps/htm-preact.js';
import { getData, postData } from '../utils/utils.js';

export function useGetData(url) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState();
  useEffect(() => {
    let didCancel = false;
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await getData(url);
        if (!didCancel) setData(results);
      } catch (err) {
        console.error(err);
        if (!didCancel) {
          setError(err);
        }
      }
      if (!didCancel) setIsLoading(false);
    };
    fetchResults();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return { isLoading, error, data };
}

/**
 *
 * @param {*} url
 * @param {*} stringifiedParams
 * @returns object
 *
 * takes stringified body to avoid upstreams having to use useMemo()
 */
export function usePostData(url, stringifiedParams) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState();
  useEffect(() => {
    let didCancel = false;
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await postData(url, stringifiedParams);

        if (!didCancel) setData(results);
      } catch (err) {
        console.error(err);
        if (!didCancel) {
          setError(err);
        }
      }
      if (!didCancel) setIsLoading(false);
    };
    fetchResults();
    return () => {
      didCancel = true;
    };
  }, [url, stringifiedParams]);
  return { isLoading, error, data };
}
