import { connect, WalletConnection, Contract, utils, keyStores } from 'near-api-js';
import { config } from '@/service/blockChainConfig';

export async function initNear(): Promise<{ near: any; walletConnection: WalletConnection }> {
  const near = await connect({
    ...config,
    deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
  });

  const walletConnection = new WalletConnection(near, "ed25519");
  return { near, walletConnection };
}

export async function sendNearTokens(receiverId: string, amountInNear: string): Promise<any> {
  const { walletConnection } = await initNear();
  const account = walletConnection.account();

  try {
    const amountInYoctoNear = utils.format.parseNearAmount(amountInNear);
    if (!amountInYoctoNear) {
      throw new Error('Invalid amount');
    }
    const result = await account.sendMoney(receiverId, BigInt(amountInYoctoNear));
    return result;
  } catch (error) {
    console.error('Error sending NEAR tokens:', error);
    throw error;
  }
}
