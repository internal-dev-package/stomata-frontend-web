// src/lib/landContract.ts
import { createPublicClient, http, type Address } from "viem";
import { liskSepolia } from "viem/chains";
import { LAND_NFT_ABI } from "../types/land";

const RPC = (import.meta.env.VITE_RPC_URL as string) || "https://rpc.sepolia-api.lisk.com";
export const LAND_CONTRACT = (import.meta.env.VITE_LAND_NFT_ADDRESS as Address) || "0x8D3E3930b882a983bBC401Fc409Ac69EB55BbD37";

const client = createPublicClient({
  chain: liskSepolia,
  transport: http(RPC),
});

export async function landBalanceOf(owner: Address) {
  return await client.readContract({
    address: LAND_CONTRACT,
    abi: LAND_NFT_ABI,
    functionName: "balanceOf",
    args: [owner],
  }) as bigint;
}

export async function landTokenOfOwnerByIndex(owner: Address, index: bigint) {
  return await client.readContract({
    address: LAND_CONTRACT,
    abi: LAND_NFT_ABI,
    functionName: "tokenOfOwnerByIndex",
    args: [owner, index],
  }) as bigint;
}

export async function landTokenURI(tokenId: bigint) {
  return await client.readContract({
    address: LAND_CONTRACT,
    abi: LAND_NFT_ABI,
    functionName: "tokenURI",
    args: [tokenId],
  }) as string;
}

export function ipfsToHttp(uri: string) {
  // support ipfs://CID or bare CID
  const base = "https://gateway.pinata.cloud/ipfs/";
  if (uri.startsWith("ipfs://")) return base + uri.replace("ipfs://", "");
  if (/^[a-z0-9]{46,}/i.test(uri)) return base + uri;
  return uri;
}

export async function getOwnedLands(owner: Address) {
  const n = await landBalanceOf(owner);
  const items: Array<{ tokenId: bigint; tokenURI: string; meta?: any }> = [];
  for (let i = 0n; i < n; i++) {
    const tokenId = await landTokenOfOwnerByIndex(owner, i);
    const uri = await landTokenURI(tokenId);
    const httpUrl = ipfsToHttp(uri);
    let meta: any = null;
    try {
      const res = await fetch(httpUrl);
      if (res.ok) meta = await res.json();
    } catch {}
    items.push({ tokenId, tokenURI: uri, meta });
  }
  return items;
}
