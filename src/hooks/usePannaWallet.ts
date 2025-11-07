// src/hooks/usePannaWallet.tsx
import { useCallback, useMemo } from "react";
import { usePanna, useActiveAccount, liskSepolia } from "panna-sdk";
import { getContract } from "thirdweb/contract";
import {
  prepareContractCall,
  sendTransaction,
  waitForReceipt,
} from "thirdweb/transaction";
import { toWei } from "thirdweb/utils";
import type { Abi, AbiFunction } from "viem";

export interface SendContractCallArgs {
  address: `0x${string}`;
  abi: Abi;                 // viem Abi
  functionName: string;     // ex: "mintFarmer"
  params?: any[];           // argumen sesuai ABI
  valueEth?: string;        // untuk payable, ex: "0.001"
}

export function usePannaRelay() {
  const { client } = usePanna();
  const active = useActiveAccount();

  const pannaReady = !!client;
  const pannaError = pannaReady ? null : "Panna client not initialized";
  const address = active?.address ?? null;

  // Helper write call yang "sesuai tutorial": Panna client + Thirdweb + ABI
  const sendContractCall = useCallback(
    async ({ address, abi, functionName, params = [], valueEth }: SendContractCallArgs) => {
      if (!client) throw new Error("Panna client not ready");
      if (!active) throw new Error("Wallet not connected");

      const contract = getContract({
        client,
        chain: liskSepolia,
        address,
        abi, // wajib untuk type inference Thirdweb
      });

      // Bangun signature dari ABI → "function mintFarmer(address,string)"
      const frag = (abi as Abi).find(
        (f) => (f as AbiFunction)?.type === "function" && (f as AbiFunction)?.name === functionName
      ) as AbiFunction | undefined;

      if (!frag) {
        throw new Error(`Function "${functionName}" not found in ABI`);
      }

      const inputTypes = (frag.inputs ?? []).map((i) => i.type).join(",");
      const signature = `function ${functionName}(${inputTypes})` as const;

      const tx = prepareContractCall({
        contract,
        method: signature,
        params,
        value: valueEth ? toWei(valueEth) : undefined,
      });

      const result = await sendTransaction({
        account: active,
        transaction: tx,
      });

      // (opsional) tunggu mined
      return waitForReceipt(result);
    },
    [client, active]
  );

  return useMemo(
    () => ({
      client,
      account: active ?? null,
      address,
      pannaReady,
      pannaError,
      sendContractCall,   // ✅ satu-satunya API kirim tx (gasless by Panna)
    }),
    [client, active, address, pannaReady, pannaError, sendContractCall]
  );
}
