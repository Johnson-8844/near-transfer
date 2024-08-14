"use client"
import React, { useContext, useState } from 'react';
import { NearContext } from '@/wallets/WalletSelector';
import * as nearAPI from "near-api-js";

const WalletActions: React.FC = () => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [isTransferring, setIsTransferring] = useState(false);

  // console.log("Wallet ", wallet)
  console.log("signedAccountId ", signedAccountId)

  const handleSignIn = async () => {
    if (wallet) {
      await wallet.signIn();
    }
  };

  const handleSignOut = async () => {
    if (wallet) {
      await wallet.signOut();
    }
  };

  const handleTransfer = async () => {
    if (!wallet || !signedAccountId) {
      alert('Please sign in first.');
      return;
    }

    try {
      setIsTransferring(true);
      const amountInYocto = nearAPI.utils.format.parseNearAmount("0.05");

      const transaction = {
        receiverId: 'sweety08.testnet', 
        actions: [
          {
            type: "Transfer",
            params: {
              deposit: amountInYocto,
            },
          },
        ],
      };

      await wallet.signAndSendTransactions({ transactions: [transaction] });
      alert('Transfer successful!');
    } catch (error) {
      console.error('Transfer failed:', error);
      alert('Transfer failed. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className='flex gap-5'>
      <br /><br />
      <button onClick={handleSignIn} disabled={!!signedAccountId}>
        {signedAccountId ? `Signed In: ${signedAccountId}` : 'Sign In'}
      </button>
      <br /><br />
      <button onClick={handleTransfer} disabled={!signedAccountId || isTransferring}>
        {isTransferring ? 'Transferring...' : 'Transfer 1 NEAR'}
      </button>
      <button onClick={handleSignOut} disabled={!signedAccountId}>
        {signedAccountId ? `Sign Out` : ''}
      </button>
    </div>
  );
};

export default WalletActions;

