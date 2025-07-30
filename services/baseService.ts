import { 
  createBaseAccountSDK, 
  pay as basePay, 
  getPaymentStatus as baseGetPaymentStatus
} from '@base-org/account';

// This file now uses the actual Base SDK.

type WalletConnectResponse = {
accounts: {
    address: string;
    capabilities: {
        signInWithEthereum: unknown;
    };
}[];
};

type EthAccountsResponse = string[];

/**
* Initiates the "Sign in with Base" flow using the Base Account SDK.
* @returns A promise that resolves with the user's wallet address.
*/
export const signInWithBase = async (): Promise<string> => {
console.log('Initiating Sign in with Base...');

try {
  // The SDK needs a provider. It can find one from browser extensions like Coinbase Wallet.
  const baseAccountSDK = createBaseAccountSDK({ appName: 'FundMyWish' });
  const provider = baseAccountSDK.getProvider();

  if (!provider) {
    throw new Error('No wallet provider found. Please install Coinbase Wallet or another Base-compatible wallet.');
  }

  // First, try to get existing accounts (if already connected)
  let accounts: string[] = [];
  
  try {
    accounts = await provider.request({
      method: 'eth_accounts',
      params: []
    }) as EthAccountsResponse;
  } catch (err) {
    console.log('No existing accounts found, requesting connection...');
  }

  // If no existing accounts, request wallet connection
  if (!accounts || accounts.length === 0) {
    try {
      accounts = await provider.request({
        method: 'eth_requestAccounts',
        params: []
      }) as EthAccountsResponse;
    } catch (err) {
      console.error('Failed to request accounts:', err);
      throw new Error('User denied wallet connection or wallet not available.');
    }
  }

  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts returned from wallet.');
  }

  const address = accounts[0];
  console.log('Connected with address:', address);

  // Optional: Switch to Base network if needed
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x14a34' }], // Base Sepolia
    });
  } catch (switchError: any) {
    // If the chain doesn't exist, add it
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x14a34',
            chainName: 'Base Sepolia',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://sepolia.base.org'],
            blockExplorerUrls: ['https://sepolia-explorer.base.org'],
          }],
        });
      } catch (addError) {
        console.error('Failed to add Base Sepolia network:', addError);
      }
    }
  }

  return address;
  
} catch (err) {
  console.error('Sign in with Base failed:', err);
  throw err;
}
};

/**
* Alternative method using the wallet_connect approach (if needed for specific Base features)
*/
export const signInWithBaseConnect = async (): Promise<string> => {
console.log('Initiating Sign in with Base using wallet_connect...');

const baseAccountSDK = createBaseAccountSDK({ appName: 'FundMyWish' });
const provider = baseAccountSDK.getProvider();

if (!provider) {
  throw new Error('No wallet provider found. Please install Coinbase Wallet or another Base-compatible wallet.');
}

// Nonce generation as per SIWE standard
const nonce = window.crypto.randomUUID().replace(/-/g, '');

try {
  const response = await provider.request({
    method: 'wallet_connect',
    params: [{
      version: '1',
      capabilities: {
        signInWithEthereum: {
          nonce,
          chainId: '0x14a34' // Base Sepolia 84532
        }
      }
    }]
  });
  
  const { accounts } = response as WalletConnectResponse;

  if (accounts && accounts.length > 0 && accounts[0].capabilities.signInWithEthereum) {
    const { address } = accounts[0];
    console.log('Signed in with address:', address);
    return address;
  } else {
    throw new Error('No accounts returned from wallet.');
  }
} catch (err) {
  console.error('Sign in with Base failed:', err);
  throw err;
}
};

/**
* Initiates a USDC payment using the Base Pay SDK.
* @param params - The payment details, inferred from the SDK.
* @returns A promise that resolves with the payment response.
*/
export const pay = async (params: Parameters<typeof basePay>[0]): Promise<Awaited<ReturnType<typeof basePay>>> => {
  return basePay(params);
};

/**
* Checks the status of a Base Pay payment.
* @param params - The payment ID to check, inferred from the SDK.
* @returns A promise that resolves with the payment status.
*/
export const getPaymentStatus = async (params: Parameters<typeof baseGetPaymentStatus>[0]): Promise<Awaited<ReturnType<typeof baseGetPaymentStatus>>> => {
  return baseGetPaymentStatus(params);
};