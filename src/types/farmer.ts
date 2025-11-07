// src/types/farmer.ts
import type { Abi } from "viem";

export interface FarmerMetadata {
  type: 'farmer'
  version?: string
  company: {
    name: string
    owner?: Record<string, any>
    address?: Record<string, any>
  }
  farmer: {
    id: string
    name: string
    nik: string
    age: number
    gender: string
    address?: Record<string, any>
  }
  name?: string
  description?: string
  image?: string
  attributes?: Array<{ trait_type: string; value: any }>
}

export const FARMER_NFT_ABI = [
  { "inputs": [], "name": "name", "outputs":[{"internalType":"string","name":"","type":"string"}], "stateMutability":"view","type":"function" },
  { "inputs": [], "name": "symbol", "outputs":[{"internalType":"string","name":"","type":"string"}], "stateMutability":"view","type":"function" },
  { "inputs": [], "name": "totalSupply", "outputs":[{"internalType":"uint256","name":"","type":"uint256"}], "stateMutability":"view","type":"function" },
  { "inputs": [{"internalType":"uint256","name":"tokenId","type":"uint256"}], "name":"tokenURI", "outputs":[{"internalType":"string","name":"","type":"string"}], "stateMutability":"view","type":"function" },
  { "inputs": [], "name":"basePinataGateway", "outputs":[{"internalType":"string","name":"","type":"string"}], "stateMutability":"view", "type":"function" },
  { "inputs":[ {"internalType":"address","name":"to","type":"address"}, {"internalType":"string","name":"ipfsCid","type":"string"} ], "name":"mintFarmer", "outputs":[{"internalType":"uint256","name":"","type":"uint256"}], "stateMutability":"nonpayable", "type":"function" }
] as const satisfies Abi;

export const FARMER_NFT_INTERFACE_NAME = 'FarmerNFT';
