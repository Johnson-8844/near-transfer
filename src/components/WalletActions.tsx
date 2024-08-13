"use client"
import React, { useContext, useEffect, useState } from 'react';
import { NearContext } from '@/wallets/WalletSelector';

const WalletActions: React.FC = () => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [isTransferring, setIsTransferring] = useState(false);

  const handleSignIn = async () => {
    if (wallet) {
      await wallet.signIn();
    }
  };

  const handleTransfer = async () => {
    if (!wallet || !signedAccountId) {
      alert('Please sign in first.');
      return;
    }

    try {
      setIsTransferring(true);

      const transaction = {
        receiverId: 'sweety08.testnet', 
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: 'transfer',
              args: {}, 
              gas: '30000000000000', 
              deposit: '1000000000000000000000000', 
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
    </div>
  );
};

export default WalletActions;






// const [balance, setBalance] = useState<any>(0);

// useEffect(()=>{
//   const res = wallet?.getBalance("sweety08.testnet");
//   setBalance(res)
// }, [])
