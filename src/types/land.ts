// src/types/land.ts
// ABI minimal namun lengkap sesuai fungsi publik yg kamu tulis
export const LAND_NFT_ABI = [
  // --- ERC165 / base ---
  { "type":"function","name":"supportsInterface","stateMutability":"view","inputs":[{"name":"interfaceId","type":"bytes4"}],"outputs":[{"type":"bool"}] },
  // --- Roles / Admin helpers ---
  { "type":"function","name":"DEFAULT_ADMIN_ROLE","stateMutability":"view","inputs":[],"outputs":[{"type":"bytes32"}] },
  { "type":"function","name":"COMPANY_OWNER_ROLE","stateMutability":"view","inputs":[],"outputs":[{"type":"bytes32"}] },
  { "type":"function","name":"getRoleAdmin","stateMutability":"view","inputs":[{"name":"role","type":"bytes32"}],"outputs":[{"type":"bytes32"}] },
  { "type":"function","name":"hasRole","stateMutability":"view","inputs":[{"name":"role","type":"bytes32"},{"name":"account","type":"address"}],"outputs":[{"type":"bool"}] },
  { "type":"function","name":"grantRole","stateMutability":"nonpayable","inputs":[{"name":"role","type":"bytes32"},{"name":"account","type":"address"}],"outputs":[] },
  { "type":"function","name":"revokeRole","stateMutability":"nonpayable","inputs":[{"name":"role","type":"bytes32"},{"name":"account","type":"address"}],"outputs":[] },
  { "type":"function","name":"renounceRole","stateMutability":"nonpayable","inputs":[{"name":"role","type":"bytes32"},{"name":"callerConfirmation","type":"address"}],"outputs":[] },
  { "type":"function","name":"grantAdminRole","stateMutability":"nonpayable","inputs":[{"name":"newAdmin","type":"address"}],"outputs":[] },
  { "type":"function","name":"revokeAdminRole","stateMutability":"nonpayable","inputs":[{"name":"oldAdmin","type":"address"}],"outputs":[] },

  // --- Metadata helpers ---
  { "type":"function","name":"name","stateMutability":"view","inputs":[],"outputs":[{"type":"string"}] },
  { "type":"function","name":"symbol","stateMutability":"view","inputs":[],"outputs":[{"type":"string"}] },
  { "type":"function","name":"basePinataGateway","stateMutability":"view","inputs":[],"outputs":[{"type":"string"}] },
  { "type":"function","name":"setBasePinataGateway","stateMutability":"nonpayable","inputs":[{"name":"newBase","type":"string"}],"outputs":[] },

  // --- Supply / enumeration ---
  { "type":"function","name":"totalSupply","stateMutability":"view","inputs":[],"outputs":[{"type":"uint256"}] },
  { "type":"function","name":"tokenByIndex","stateMutability":"view","inputs":[{"name":"index","type":"uint256"}],"outputs":[{"type":"uint256"}] },
  { "type":"function","name":"balanceOf","stateMutability":"view","inputs":[{"name":"owner","type":"address"}],"outputs":[{"type":"uint256"}] },
  { "type":"function","name":"tokenOfOwnerByIndex","stateMutability":"view","inputs":[{"name":"owner","type":"address"},{"name":"index","type":"uint256"}],"outputs":[{"type":"uint256"}] },

  // --- Ownership ---
  { "type":"function","name":"ownerOf","stateMutability":"view","inputs":[{"name":"tokenId","type":"uint256"}],"outputs":[{"type":"address"}] },

  // --- Token URI ---
  { "type":"function","name":"tokenURI","stateMutability":"view","inputs":[{"name":"tokenId","type":"uint256"}],"outputs":[{"type":"string"}] },

  // --- Approvals / transfers ---
  { "type":"function","name":"approve","stateMutability":"nonpayable","inputs":[{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],"outputs":[] },
  { "type":"function","name":"getApproved","stateMutability":"view","inputs":[{"name":"tokenId","type":"uint256"}],"outputs":[{"type":"address"}] },
  { "type":"function","name":"setApprovalForAll","stateMutability":"nonpayable","inputs":[{"name":"operator","type":"address"},{"name":"approved","type":"bool"}],"outputs":[] },
  { "type":"function","name":"isApprovedForAll","stateMutability":"view","inputs":[{"name":"owner","type":"address"},{"name":"operator","type":"address"}],"outputs":[{"type":"bool"}] },
  { "type":"function","name":"transferFrom","stateMutability":"nonpayable","inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],"outputs":[] },
  { "type":"function","name":"safeTransferFrom","stateMutability":"nonpayable","inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],"outputs":[] },
  { "type":"function","name":"safeTransferFrom","stateMutability":"nonpayable","inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"},{"name":"data","type":"bytes"}],"outputs":[] },

  // --- Custom mint / burn ---
  { "type":"function","name":"mintLand","stateMutability":"nonpayable","inputs":[{"name":"to","type":"address"},{"name":"ipfsCid","type":"string"}],"outputs":[{"type":"uint256"}] },
  { "type":"function","name":"burn","stateMutability":"nonpayable","inputs":[{"name":"tokenId","type":"uint256"}],"outputs":[] },
] as const;

export type LandNftAbi = typeof LAND_NFT_ABI;
