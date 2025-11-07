// Test script for minting FarmerNFT
// Usage: 
//   1. Set env vars in .env.local:
//      RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
//      TEST_PRIVATE_KEY=your_test_private_key
//      FARMER_NFT_ADDRESS=0x496134698D2EC80b20BDf8aEcb67f56818ad50cf
//   2. Run: node scripts/mint-farmer.js [CID]
//   3. CID is optional - if not provided, will use example metadata
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local from frontend root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');
console.log('Looking for .env file at:', envPath);
dotenv.config({ path: envPath });

// Full ABI with all functions for debugging
const FARMER_NFT_ABI = [
  // ERC721 Standard functions
  { "inputs": [], "name": "name", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "symbol", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "totalSupply", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function" },
  { "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "tokenURI", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "stateMutability": "view", "type": "function" },
  { "inputs": [{"internalType": "address", "name": "owner", "type": "address"}], "name": "balanceOf", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function" },
  { "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "ownerOf", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function" },
  { "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "getApproved", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function" },
  { "inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {"internalType": "address", "name": "operator", "type": "address"}], "name": "isApprovedForAll", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function" },
  { "inputs": [{"internalType": "address", "name": "operator", "type": "address"}, {"internalType": "bool", "name": "approved", "type": "bool"}], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  
  // ERC721Enumerable functions
  { "inputs": [{"internalType": "uint256", "name": "index", "type": "uint256"}], "name": "tokenByIndex", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function" },
  { "inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {"internalType": "uint256", "name": "index", "type": "uint256"}], "name": "tokenOfOwnerByIndex", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function" },
  
  // Ownable functions
  { "inputs": [], "name": "owner", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  
  // Custom functions
  { "inputs": [], "name": "basePinataGateway", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "stateMutability": "view", "type": "function" },
  { "inputs": [{"internalType": "string", "name": "newBase", "type": "string"}], "name": "setBasePinataGateway", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {"internalType": "string", "name": "ipfsCid", "type": "string"}], "name": "mintFarmer", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{"internalType": "bytes4", "name": "interfaceId", "type": "bytes4"}], "name": "supportsInterface", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function" },
  
  // Transfer functions
  { "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {"internalType": "bytes", "name": "data", "type": "bytes"}], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

async function main() {
  // Check env vars
  const rpcUrl = process.env.RPC_URL || process.env.VITE_RPC_URL;
  const privateKey = process.env.TEST_PRIVATE_KEY;
  const contractAddr = process.env.FARMER_NFT_ADDRESS || process.env.FARMER_NFT_ADDRESS;
  
  // Debug environment variables
  console.log('Environment variables:');
  console.log('- RPC_URL:', process.env.RPC_URL ? '[set]' : '[not set]');
  console.log('- VITE_RPC_URL:', process.env.VITE_RPC_URL ? '[set]' : '[not set]');
  console.log('- FARMER_NFT_ADDRESS:', process.env.FARMER_NFT_ADDRESS ? '[set]' : '[not set]');
  console.log('- FARMER_NFT_ADDRESS:', process.env.FARMER_NFT_ADDRESS ? '[set]' : '[not set]');
  console.log('Using contract address:', contractAddr);
  
  if (!rpcUrl || !privateKey || !contractAddr) {
    console.error('Please set RPC_URL, TEST_PRIVATE_KEY, and FARMER_NFT_ADDRESS in .env.local');
    process.exit(1);
  }
  
  // Validate contract address format
  if (!ethers.isAddress(contractAddr)) {
    console.error('Invalid contract address format:', contractAddr);
    process.exit(1);
  }

  // Get CID from args or use example
  const cid = process.argv[2] || 'QmWCPWZat5fLSJBcgbTAk65SX2ngtbtbKWun9X1kv369pv';

  try {
    // Connect to network
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log('Using wallet address:', wallet.address);

    // Get contract
    const contract = new ethers.Contract(contractAddr, FARMER_NFT_ABI, wallet);
    console.log('Contract address:', contractAddr);
    
    // Debug contract info first
    try {
      console.log('Contract name:', await contract.name());
      console.log('Contract symbol:', await contract.symbol());
    } catch (err) {
      console.log('Could not get contract name/symbol:', err.message);
    }
    
    // Check if contract exists and verify details
    try {
      const code = await provider.getCode(contractAddr);
      if (code === '0x') {
        throw new Error('No contract deployed at this address');
      }
      console.log('Contract exists at address');

      // Get contract details
      console.log('Getting contract details...');
      
      // Some contracts may restrict access to owner() or revert; guard it
      let contractOwner = null;
      try {
        contractOwner = await contract.owner();
        console.log('Contract owner:', contractOwner);
      } catch (err) {
        console.log('Could not read owner():', err.message);
        console.log('Continuing without owner() check...');
      }

      console.log('Our wallet:', wallet.address);
      const name = await contract.name();
      const symbol = await contract.symbol();
      const totalSupply = await contract.totalSupply();
      const gateway = await contract.basePinataGateway();

      console.log('Contract Details:');
      console.log('- Name:', name);
      console.log('- Symbol:', symbol, '(Soulbound Token)');
      console.log('- Total Supply:', totalSupply.toString());
      console.log('- Pinata Gateway:', gateway);

      // Check wallet balance (ERC721 balanceOf)
      try {
        const balance = await contract.balanceOf(wallet.address);
        console.log('Wallet NFT balance:', balance.toString());
      } catch (err) {
        console.log('Could not read balanceOf():', err.message);
      }

      if (contractOwner && contractOwner.toLowerCase() !== wallet.address.toLowerCase()) {
        console.warn('WARNING: Wallet is not the contract owner. Minting may fail.');
        console.warn('Only the contract owner can mint new tokens.');
        console.warn('Consider using the owner wallet:', contractOwner);
      }

    } catch (err) {
      console.error('Error checking contract:', err.message);
      process.exit(1);
    }
    
    // Try to get total supply
    try {
      const totalBefore = await contract.totalSupply();
      console.log('Total supply before:', totalBefore.toString());
    } catch (err) {
      console.log('Could not get total supply:', err.message);
      console.log('Continuing without total supply...');
    }
    
    // Get network gas info
    console.log('Getting network gas info...');
    const feeData = await provider.getFeeData();
    
    // Log fee data if available
    if (feeData.gasPrice) {
      console.log('Gas Price:', ethers.formatUnits(feeData.gasPrice, 'gwei'), 'gwei');
    }
    if (feeData.maxFeePerGas) {
      console.log('Max Fee:', ethers.formatUnits(feeData.maxFeePerGas, 'gwei'), 'gwei');
      console.log('Max Priority Fee:', ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei'), 'gwei');
    }
    
    // Get wallet balance
    const balance = await provider.getBalance(wallet.address);
    console.log('Wallet balance:', ethers.formatEther(balance), 'ETH');
    
    // Get gas estimate first
    console.log('\nPreparing mint transaction...');
    console.log('CID:', cid);
    console.log('To address:', wallet.address);
    
    // Get function selector for debugging
    const iface = new ethers.Interface(FARMER_NFT_ABI);
    const data = iface.encodeFunctionData('mintFarmer', [wallet.address, cid]);
    console.log('Function selector:', data.slice(0, 10));
    
    // Estimate gas with a try/catch to get more error details
    let gasEstimate;
    try {
      console.log('Estimating gas...');
      gasEstimate = await contract.mintFarmer.estimateGas(wallet.address, cid);
      console.log('Gas estimate:', gasEstimate.toString());
    } catch (err) {
      // If provider returned data, try to decode it; otherwise just log
      const errData = err.data || (err.info && err.info.error && err.info.error.data) || null;
      if (errData) {
        try {
          const decodedError = iface.parseError(errData);
          console.error('Contract custom error:', decodedError.name);
          console.error('Error args:', decodedError.args);
        } catch (decodeErr) {
          console.error('Raw error data:', errData);
        }
      } else {
        console.error('Estimate gas failed without revert data:', err.message);
      }
      throw err;
    }
    
    // Prepare transaction with appropriate gas options based on network type
    const txOptions = {
      gasLimit: BigInt(Math.ceil(Number(gasEstimate) * 1.2)) // 20% buffer, handle BigInt conversion
    };
    
    // Add fee data if available
    if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
      // EIP-1559 network
      txOptions.maxFeePerGas = feeData.maxFeePerGas;
      txOptions.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
    } else if (feeData.gasPrice) {
      // Legacy network
      txOptions.gasPrice = feeData.gasPrice;
    }
    
    console.log('\nSending transaction with options:', txOptions);
    
    const tx = await contract.mintFarmer(wallet.address, cid, txOptions);
    console.log('Transaction hash:', tx.hash);

    // Wait for confirmation
    console.log('Waiting for confirmation...');
    try {
      const receipt = await tx.wait();
      console.log('Transaction confirmed in block:', receipt.blockNumber);
      
      // Check if there were any events emitted
      if (receipt.logs && receipt.logs.length > 0) {
        console.log('Events emitted:', receipt.logs.length);
        for (const log of receipt.logs) {
          console.log('Log:', log);
        }
      }
    } catch (err) {
      console.error('Transaction failed:', err.message);
      if (err.data) {
        console.error('Error data:', err.data);
      }
      throw err;
    }

    // Get new total supply
    const totalAfter = await contract.totalSupply();
    console.log('Total supply after:', totalAfter.toString());
    console.log('Success! New token ID:', totalAfter.toString());

  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();