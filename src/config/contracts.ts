export function getFarmerContractAddress(): `0x${string}` {
  const raw = '0x97d2960C8bE144794308C48f39D7fb7B883D1960';
  if (!raw) throw new Error("Missing FARMER_NFT_ADDRESS in .env");
  const addr = String(raw).trim();
  if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) {
    throw new Error(`FARMER_NFT_ADDRESS is not a valid 0x address: ${addr}`);
  }
  return addr as `0x${string}`;
}
