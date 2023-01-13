import { useState, useEffect } from '../../../deps/htm-preact.js';
import { fetchData } from '../utils/utils.js';

export default function useGetData(url) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState();
  useEffect(() => {
    let didCancel = false;
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await fetchData(url);
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
