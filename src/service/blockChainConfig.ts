import { connect, keyStores, WalletConnection, Near } from 'near-api-js';
import path from 'path';

interface TokenContracts {
  USDC: string | undefined;
  USDT: string | undefined;
  TUSD: string | undefined;
  PAX: string | undefined;
}

interface NetworkConfig {
  networkId: string;
  nodeUrl: string;
  walletUrl: string;
  helperUrl: string;
  contracts: TokenContracts;
}

const tokenContracts: { mainnet: TokenContracts; testnet: TokenContracts } = {
  mainnet: {
    USDC: process.env.USDC_MAINNET_CONTRACT,
    USDT: process.env.USDT_MAINNET_CONTRACT,
    TUSD: process.env.TUSD_MAINNET_CONTRACT,
    PAX: process.env.PAX_MAINNET_CONTRACT,
  },
  testnet: {
    USDC: process.env.USDC_TESTNET_CONTRACT,
    USDT: process.env.USDT_TESTNET_CONTRACT,
    TUSD: process.env.TUSD_TESTNET_CONTRACT,
    PAX: process.env.PAX_TESTNET_CONTRACT,
  }
};

const environment = process.env.NODE_ENV || 'development';
const isDevelopment = environment === 'development';

const networkConfig: { mainnet: NetworkConfig; testnet: NetworkConfig } = {
  mainnet: {
    networkId: 'mainnet',
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    contracts: tokenContracts.mainnet,
  },
  testnet: {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    contracts: tokenContracts.testnet,
  }
};

const config: NetworkConfig = isDevelopment ? networkConfig.testnet : networkConfig.mainnet;

export async function initializeConnection(): Promise<{ near: Near; wallet: WalletConnection; contracts: TokenContracts }> {
  const keyStore = new keyStores.UnencryptedFileSystemKeyStore(path.join(__dirname, './near-credentials'));
  const near = await connect({ deps: { keyStore }, ...config });

  const wallet = new WalletConnection(near, "ed25519");
  return { near, wallet, contracts: config.contracts };
}

export { config };
