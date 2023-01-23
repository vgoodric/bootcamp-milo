import { useEffect } from '../../../deps/htm-preact.js';

export default function useFetchAPI(skip, dispatch, actionType, fetchDataFunc) {
  useEffect(() => {
    if (skip) return;
    let didCancel = false;
    const fetchResults = async () => {
      dispatch({
        type: actionType,
        payload: { loading: true, error: null, value: null },
      });
      try {
        const data = await fetchDataFunc();
        if (!didCancel) {
          dispatch({
            type: actionType,
            payload: { loading: false, error: null, value: data },
          });
        }
      } catch (err) {
        console.error(`Error when fetching data: ${err}`);
        if (!didCancel) {
          dispatch({
            type: actionType,
            payload: { loading: false, error: err, value: null },
          });
        }
      }
    };
    fetchResults();
    return () => {
      didCancel = true;
    };
  }, [dispatch, actionType, fetchDataFunc, skip]);
}
