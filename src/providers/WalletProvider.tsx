"use client"
import React, { useState, useEffect, useContext } from 'react';
import { Wallet, NearContext } from '@/wallets/WalletSelector';
import { networkId } from '@/utils/config';

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet>();
  const [signedAccountId, setSignedAccountId] = useState<string>('');

  useEffect(() => {
    const walletInstance = new Wallet({ networkId, createAccessKeyFor: 'minsta.mintspace2.testnet' });
    walletInstance.startUp(setSignedAccountId);
    setWallet(walletInstance);
  }, []);

  return (
    <NearContext.Provider value={{ wallet, signedAccountId }}>
      {children}
    </NearContext.Provider>
  );
};
