import { ethers } from 'ethers';
import { FARMER_NFT_ABI } from '../types/farmer';

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
  return { to: FARMER_NFT_ADDRESS, data };
}

export function getBasePinataGateway(): string | undefined {
  return import.meta.env.VITE_BASE_PINATA_GATEWAY as string | undefined;
}
