import { useEffect, useState } from "react";
import API from "../services/api";

export function useFetch(url, { immediate = true, fallback = null } = {}) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(url);
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, error, refetch, setData };
}
