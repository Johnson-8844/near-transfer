"use client"
import { connect, WalletConnection, keyStores } from "near-api-js";
import { useEffect, useState } from "react";

export default function Home() {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  useEffect(() => {
    // Initialize NEAR connection only on the client side
    async function initNear() {
      // const config = {
      //   networkId: 'testnet', // Use 'mainnet' for production
      //   nodeUrl: 'https://rpc.testnet.near.org',
      //   walletUrl: 'https://wallet.testnet.near.org',
      //   helperUrl: 'https://helper.testnet.near.org',
      //   explorerUrl: 'https://explorer.testnet.near.org',
      // };
      
      // // Set up the connection to the NEAR blockchain
      // const keyStore = new keyStores.BrowserLocalStorageKeyStore();
      // const near = await connect({ deps: { keyStore }, ...config });
      // const walletConnection = new WalletConnection(near, "ed25519");
      const nearConfig = {
        networkId: "testnet", // Use "mainnet" for production
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org", // Use "https://rpc.mainnet.near.org" for production
        walletUrl: "https://wallet.testnet.near.org", // Use "https://wallet.mainnet.near.org" for production
        helperUrl: "https://helper.testnet.near.org", // Use "https://helper.mainnet.near.org" for production
        explorerUrl: "https://explorer.testnet.near.org", // Use "https://explorer.mainnet.near.org" for production
      };

      const near = await connect(nearConfig);
      const walletConnection = new WalletConnection(near, "minsta");
      setWallet(walletConnection);
    }

    initNear();
  }, []);

  async function login() {
    if (wallet) {
      wallet.requestSignIn({
        contractId: "minstaorg.mintspace2.testnet", 
        methodNames: []
      });
    }
  }


  const transferNear = async () => {
    if (wallet && wallet.isSignedIn()) {
      const receiverId = "sweety08.testnet"; // Replace with your system NEAR address
      const amount = BigInt("1000000000000000000000000"); // Convert to bigint

      try {
        await wallet.account().sendMoney(receiverId, amount);
        alert("Transfer successful!");
      } catch (error) {
        console.error("Transfer failed:", error);
        alert("Transfer failed. Please try again.");
      }
    } else {
      alert("Please log in to your NEAR wallet first.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello</h1>
      <button id="login-button" onClick={login}>Login with NEAR Wallet</button>
      <button id="transfer-button" onClick={transferNear}>Transfer 1 NEAR</button>
    </main>
  );
}
