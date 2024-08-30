"use client"
import React, { useContext, useEffect, useState } from 'react';
import { NearContext } from '@/wallets/WalletSelector';
import { KeyPair } from 'near-api-js/lib/utils';
import useKeypomNFTDrop from '@/utils/useKeyPomNftDrop';
import useGeneral from '@/utils/general';

const NFTDropActions: React.FC = () => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const { mintNFT, createDrop, transferNFTToKeypom, getRecentDropId } = useKeypomNFTDrop();
  // const { getRecentDropId } = useGeneral();
  let keyPairs: any[] = [];

  const handleCreateDrop = async () => {
    
    let pubKeys = [];
    // Generate keypairs and store them into the arrays defined above
    let keyPair = await KeyPair.fromRandom('ed25519');
    keyPairs.push(keyPair);
    pubKeys.push(keyPair.getPublicKey().toString());

    console.log("Keys >> ", pubKeys);

    await createDrop(pubKeys);

  }

  const handleNftMint = async () => {
    await mintNFT();
  }

  const handleTransferNFT= async () => {
    const dropId = await getRecentDropId(signedAccountId)
    console.log("Drop id >> ", dropId)
    const tokenId = "556";
    await transferNFTToKeypom(tokenId, dropId, keyPairs);
  }

  return (
    <div className='flex gap-5'>
      <br /><br /><br />
      {/* <button onClick={handleNftMint}>Mint NFT </button> */}
      <button onClick={handleCreateDrop}>Create Drop </button>
      <button onClick={handleTransferNFT}>Transfer NFT to keypom </button>
    </div>
  );
};

export default NFTDropActions;