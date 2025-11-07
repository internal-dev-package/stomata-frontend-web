// /src/lib/farmerContract.ts
import { ethers } from 'ethers';
// ⬇️ kamu meletakkan ABI & tipe di /lib/farmer.ts (bukan /types)
import { FARMER_NFT_ABI } from '../types/farmer.ts';

const RPC_URL = (import.meta.env.VITE_RPC_URL as string) || '';
const FARMER_NFT_ADDRESS = (import.meta.env.VITE_FARMER_NFT_ADDRESS as string) || '';

function getProvider() {
  if (!RPC_URL) {
    throw new Error('VITE_RPC_URL is not set. Please set it in .env');
  }
  return new ethers.JsonRpcProvider(RPC_URL);
}

export function getFarmerContract(readOnly = true) {
  const provider = getProvider();
  return new ethers.Contract(FARMER_NFT_ADDRESS, FARMER_NFT_ABI, provider);
}

export async function getTokenURI(tokenId: string | number | bigint) {
  const contract = getFarmerContract(true);
  const uri = await contract.tokenURI(tokenId);
  return uri as string;
}

export async function getContractInfo() {
  const contract = getFarmerContract(true);
  const [name, symbol, totalSupply] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.totalSupply()
  ]);
  return { address: FARMER_NFT_ADDRESS, name, symbol, totalSupply: String(totalSupply) };
}

// Prepare mint transaction data (FE will sign/send via wallet/Panna)
export function encodeMintFarmer(to: string, ipfsCid: string) {
  const iface = new ethers.Interface(FARMER_NFT_ABI as any);
  const data = iface.encodeFunctionData('mintFarmer', [to, ipfsCid]);
  return { to: FARMER_NFT_ADDRESS as `0x${string}`, data };
}

export function getBasePinataGateway(): string | undefined {
  return import.meta.env.VITE_BASE_PINATA_GATEWAY as string | undefined;
}

/* =========================
 *  Tambahan: READ HELPERS
 * ========================= */

export async function getTotalSupply(): Promise<bigint> {
  const c = getFarmerContract(true);
  const supply = await c.totalSupply();
  return BigInt(supply);
}

export async function tokenByIndex(index: bigint): Promise<bigint> {
  const c = getFarmerContract(true);
  const id = await c.tokenByIndex(index);
  return BigInt(id);
}

export async function ownerOf(tokenId: bigint): Promise<`0x${string}`> {
  const c = getFarmerContract(true);
  const owner = await c.ownerOf(tokenId);
  return owner as `0x${string}`;
}

export type FarmerSummary = {
  tokenId: bigint;
  owner: `0x${string}`;
  tokenURI: string;
  metadata?: any; // JSON jika berhasil di-fetch
};

/** ipfs:// → gateway http agar bisa di-fetch */
export function normalizeToHttpUrl(uri: string): string {
  if (!uri) return uri;
  if (uri.startsWith('ipfs://')) {
    const cid = uri.replace('ipfs://', '');
    const gateway = getBasePinataGateway() || 'https://gateway.pinata.cloud/ipfs/';
    return gateway.endsWith('/') ? `${gateway}${cid}` : `${gateway}/${cid}`;
  }
  return uri;
}

async function fetchJsonSafe(url: string) {
  try {
    const r = await fetch(url);
    if (!r.ok) return undefined;
    return await r.json().catch(() => undefined);
  } catch {
    return undefined;
  }
}

/**
 * Enumerasi semua token: 0..totalSupply-1
 * NOTE: kalau supply besar, pertimbangkan pagination (offset/limit).
 */
export async function fetchAllFarmers(concurrency = 5): Promise<FarmerSummary[]> {
  const supply = await getTotalSupply();
  const total = Number(supply);
  if (total === 0) return [];

  const tasks: Array<() => Promise<FarmerSummary>> = [];
  for (let i = 0; i < total; i++) {
    const idx = BigInt(i);
    tasks.push(async () => {
      const tid = await tokenByIndex(idx);
      const [own, uri] = await Promise.all([ownerOf(tid), getTokenURI(tid)]);
      const httpUri = normalizeToHttpUrl(uri);
      const metadata = await fetchJsonSafe(httpUri);
      return { tokenId: tid, owner: own, tokenURI: httpUri, metadata };
    });
  }

  const out: FarmerSummary[] = [];
  for (let i = 0; i < tasks.length; i += concurrency) {
    const chunk = tasks.slice(i, i + concurrency);
    const res = await Promise.allSettled(chunk.map(fn => fn()));
    res.forEach(r => {
      if (r.status === 'fulfilled') out.push(r.value);
    });
  }

  out.sort((a, b) => (a.tokenId < b.tokenId ? -1 : 1));
  return out;
}

/** Ambil farmer milik suatu address */
export async function fetchFarmersOfOwner(owner: string): Promise<FarmerSummary[]> {
  const c = getFarmerContract(true);

  // 1) berapa token milik owner?
  const bal: bigint = await c.balanceOf(owner);
  const count = Number(bal);
  if (count === 0) return [];

  const out: FarmerSummary[] = [];
  for (let i = 0; i < count; i++) {
    const idx = BigInt(i);
    console.log(`Fetching tokenOfOwnerByIndex for owner=${owner} index=${idx}`);
    const tokenId: bigint = await c.tokenOfOwnerByIndex(owner, idx);
    console.log(tokenId)
    const [own, uri] = await Promise.all([
      c.ownerOf(tokenId),           // verifikasi pemilik (opsional)
      c.tokenURI(tokenId),
    ]);

    const httpUri = normalizeToHttpUrl(uri);
    const metadata = await fetchJsonSafe(httpUri);

    out.push({
      tokenId,
      owner: own as `0x${string}`,
      tokenURI: httpUri,
      metadata,
    });
  }

  out.sort((a, b) => (a.tokenId < b.tokenId ? -1 : 1));
  return out;
}
