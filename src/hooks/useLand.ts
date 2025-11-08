// src/hooks/useLand.ts
import { useCallback, useMemo, useState } from "react";
import { useActiveAccount } from "panna-sdk";
import { usePannaRelay } from "../hooks/usePannaWallet";
import { LAND_NFT_ABI } from "../types/land";
import { getOwnedLands } from "../lib/landContract";
import type { Address } from "viem";

const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:3000";

export function useLand() {
  const active = useActiveAccount();
  const owner = (active?.address ?? "") as Address;
  const { sendContractCall, pannaReady, pannaError } = usePannaRelay();

  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lands, setLands] = useState<any[]>([]);

  const canTransact = useMemo(() => !!owner && pannaReady, [owner, pannaReady]);

  const refresh = useCallback(async () => {
    if (!owner) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOwnedLands(owner);
      setLands(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load lands");
    } finally {
      setLoading(false);
    }
  }, [owner]);

  const mintDemo = useCallback(async () => {
    if (!canTransact) throw new Error(pannaError || "Panna not ready");
    setMinting(true);
    setError(null);
    try {
      // 1) pin metadata via backend
      const metadata = {
        company: { name: "PT Agro Demo" },
        land: {
          id: `LAND-${Date.now()}`,
          name: "Lahan Demo",
          areaHa: 2.5,
          location: { lat: -6.9, lng: 107.6 },
          // polygon optional
        },
        ui: { image: "https://via.placeholder.com/640x360.png?text=Land+Demo", tags: ["demo", "gasless"] },
        extraAttributes: [{ trait_type: "soil", value: "Andisol" }],
      };
      const r = await fetch(`${BACKEND_URL}/lands/pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
      });
      if (!r.ok) throw new Error(`Pin failed: ${r.status} ${await r.text()}`);
      const { cid } = await r.json();
      if (!cid) throw new Error("Pin response missing cid");

      // 2) send tx gasless: mintLand(to, cid)
      await sendContractCall({
        address: import.meta.env.VITE_LAND_NFT_ADDRESS as `0x${string}`,
        // address: "0x9ea593f2cbac4671268a609bbbd7276aea7eb689",
        abi: LAND_NFT_ABI,
        functionName: "mintLand",
        params: [owner, cid],
      });

      // 3) refresh list
      await refresh();
      return cid;
    } catch (e: any) {
      setError(e?.message ?? "Mint failed");
      throw e;
    } finally {
      setMinting(false);
    }
  }, [BACKEND_URL, canTransact, owner, pannaError, refresh, sendContractCall]);

  return { owner, lands, loading, error, minting, mintDemo, refresh, canTransact };
}
