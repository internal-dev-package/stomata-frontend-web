# FarmerNFT Contract Integration (Frontend)

This document describes the minimal setup and how to use the FarmerNFT helpers added to the frontend.

## Files added

- `src/types/farmer.ts` — Farmer metadata TypeScript type + minimal ABI
- `src/lib/farmerContract.ts` — contract helper: provider, read methods, encode mint data
- `src/hooks/useFarmerContract.ts` — React hook to fetch contract info and tokenURI

These files are read-only / helper utilities and do not change any UI components.

## Environment variables (Vite)

Create a file `.env` or `.env.local` at the frontend root with these variables (Vite uses `VITE_` prefix):

VITE_RPC_URL=https://sepolia.infura.io/v3/<YOUR_KEY>
FARMER_NFT_ADDRESS=0x496134698D2EC80b20BDf8aEcb67f56818ad50cf
VITE_BASE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/

Notes:
- `VITE_RPC_URL` is used by the helper to read contract data. For any write transaction the FE wallet / Panna should sign/send the tx.

## Usage examples

1) Read contract info in a component:

const { info, loading, error } = useFarmerContract()

2) Fetch tokenURI and resolve IPFS JSON (example):

const uri = await fetchTokenURI(1)
// if ipfs://... replace with VITE_BASE_PINATA_GATEWAY or contract base gateway

3) Prepare a mint transaction (FE will sign/send using user's wallet or Panna):

import { encodeMintFarmer } from '@/lib/farmerContract'

const tx = encodeMintFarmer('0xYourAddress', 'Qm...')
// tx = { to: <contractAddress>, data: <encoded data> }

You can pass `tx` to Panna SDK or to `window.ethereum.request({ method: 'eth_sendTransaction', params: [ tx ] })` after ensuring `from` is set.

## Notes & next steps

- The helper uses a public RPC for read-only operations. Writes are intended to be performed by the FE wallet (Panna) — server will continue to return encoded `data` for ProcessContract flows as it does now.
- If you prefer Thirdweb/Panna wrappers (prepareContractCall / sendTransaction), we can add higher-level helpers later.
