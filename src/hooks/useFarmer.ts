// /src/hooks/useFarmers.ts
import { useEffect, useMemo, useState } from "react";
import {
  fetchAllFarmers,
  fetchFarmersOfOwner,
  type FarmerSummary,
} from "../lib/farmerContract";

/**
 * Hook untuk mengambil list farmer dari kontrak.
 * - Jika ownerAddress diberikan → hanya ambil milik address tsb
 * - Kalau tidak → ambil semua
 */
export function useFarmers(ownerAddress?: string) {
  const [data, setData] = useState<FarmerSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = ownerAddress
          ? await fetchFarmersOfOwner(ownerAddress)
          : await fetchAllFarmers();
        if (!cancel) setData(rows);
      } catch (e: any) {
        if (!cancel) setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [ownerAddress]);

  return useMemo(
    () => ({ data, loading, error, refetch: async () => {
      // simple manual refetch
      setLoading(true);
      setError(null);
      try {
        const rows = ownerAddress
          ? await fetchFarmersOfOwner(ownerAddress)
          : await fetchAllFarmers();
        setData(rows);
      } catch (e: any) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setLoading(false);
      }
    }}),
    [data, loading, error, ownerAddress]
  );
}
