import { useState, useEffect } from '../../../deps/htm-preact.js';
import { fetchData } from '../utils/utils.js';

export default function useGetData(url) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState();
  useEffect(() => {
    let didCancel = false;
    const fetchResults = async () => {
      setIsLoading(true);
      setIsError(false);
      const fetchAndSetState = async () => {
        try {
          const results = await fetchData(url);
          if (!didCancel) setData(results);
        } catch (err) {
          console.error(err);
          if (!didCancel) {
            setIsError(true);
          }
        }
        if (!didCancel) setIsLoading(false);
      };
      setTimeout(fetchAndSetState, 2);
    };
    fetchResults();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return { isLoading, isError, data };
}
