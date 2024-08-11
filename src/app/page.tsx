"use client"
import { connect, WalletConnection, keyStores, utils } from "near-api-js";
import { useContext, useEffect, useState } from "react";
// import { Wallet } from '@/wallets/near'
import { NetworkId, HelloNearContract } from '@/config';
import { Navigation } from "@/components/Navigation";
import { initNear, sendNearTokens } from "@/service/blockChainService";
import { NearContext, Wallet } from "@/wallets/WalletSelector";
import { WalletProvider } from "@/providers/WalletProvider";
import WalletActions from "@/components/WalletActions";

// const wallet = new Wallet({ createAccessKeyFor: HelloNearContract, networkId: NetworkId });


export default function Home() {

  return (
    
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>
          <h1>NEAR Wallet Example</h1>
          <WalletActions />
        </div>
      </main>
  );
}

// =======================================================================
// Chat GPT Method

// const [wallet, setWallet] = useState<WalletConnection | null>(null);
//   useEffect(() => {
//     // Initialize NEAR connection only on the client side
//     async function initNear() {
//       // const config = {
//       //   networkId: 'testnet', // Use 'mainnet' for production
//       //   nodeUrl: 'https://rpc.testnet.near.org',
//       //   walletUrl: 'https://wallet.testnet.near.org',
//       //   helperUrl: 'https://helper.testnet.near.org',
//       //   explorerUrl: 'https://explorer.testnet.near.org',
//       // };
      
//       // // Set up the connection to the NEAR blockchain
//       // const keyStore = new keyStores.BrowserLocalStorageKeyStore();
//       // const near = await connect({ deps: { keyStore }, ...config });
//       // const walletConnection = new WalletConnection(near, "ed25519");
//       const nearConfig = {
//         networkId: "testnet", // Use "mainnet" for production
//         keyStore: new keyStores.BrowserLocalStorageKeyStore(),
//         nodeUrl: "https://rpc.testnet.near.org", // Use "https://rpc.mainnet.near.org" for production
//         walletUrl: "https://wallet.testnet.near.org", // Use "https://wallet.mainnet.near.org" for production
//         helperUrl: "https://helper.testnet.near.org", // Use "https://helper.mainnet.near.org" for production
//         explorerUrl: "https://explorer.testnet.near.org", // Use "https://explorer.mainnet.near.org" for production
//       };

//       const near = await connect(nearConfig);
//       const walletConnection = new WalletConnection(near, "minsta");
//       setWallet(walletConnection);
//     }

//     initNear();
//   }, []);

//   async function login() {
//     if (wallet) {
//       wallet.requestSignIn({
//         contractId: "minstaorg.mintspace2.testnet", 
//         methodNames: []
//       });
//     }
//   }


//   const transferNear = async () => {
//     if (wallet && wallet.isSignedIn()) {
//       const receiverId = "sweety08.testnet"; // Replace with your system NEAR address
//       const amount = BigInt("1000000000000000000000000"); // Convert to bigint

//       try {
//         await wallet.account().sendMoney(receiverId, amount);
//         alert("Transfer successful!");
//       } catch (error) {
//         console.error("Transfer failed:", error);
//         alert("Transfer failed. Please try again.");
//       }
//     } else {
//       alert("Please log in to your NEAR wallet first.");
//     }
//   };

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <h1>Hello</h1>
//       <button id="login-button" onClick={login}>Login with NEAR Wallet</button>
//       <button id="transfer-button" onClick={transferNear}>Transfer 1 NEAR</button>
//     </main>
//   );

// =============================================================================
// NEAR DOC Method


// const [signedAccountId, setSignedAccountId] = useState('');

//   useEffect(() => { wallet.startUp(setSignedAccountId) }, []);

//   const handleTransfer = () => {
//     wallet.callMethod({
//       contractId: "token.v2.ref-finance.near",
//       method: "ft_transfer",
//       args: {
//         receiver_id: 'sweety08.testnet',
//         amount: '100000000000000000',
//       },
//       gas: "30000000000000",
//       deposit: "1"
//     })
//   }

//   return (
//     <NearContext.Provider value={{ wallet, signedAccountId }}>
//       <main className="flex min-h-screen flex-col items-center justify-between p-24">
//         <Navigation />
//         <button id="transfer-button" onClick={handleTransfer}>Transfer 1 NEAR</button>
//       </main>
//     </NearContext.Provider>
//   );


// =====================================================================
// blockchain git repo method

// const [walletConnection, setWalletConnection] = useState<any>();

//   useEffect(() => {
//     async function initializeWallet() {
//       const { walletConnection } = await initNear();
//       setWalletConnection(walletConnection);
//     }
//     initializeWallet();
//   }, []);

//   const handleLogin = () => {
//     if (walletConnection) {
//       walletConnection.requestSignIn({
//         contractId: "minstaorg.mintspace2.testnet"
//       });
//     }
//   };

//   const handleTransfer = async () => {
//     if (walletConnection && walletConnection.isSignedIn()) {
//       try {
//         await sendNearTokens("sweety08.testnet", "1");
//         alert("Transfer successful");
//       } catch (error) {
//         console.error("Error during transfer:", error);
//       }
//     } else {
//       alert("Please log in first.");
//     }
//   };
//   return (
//         <main className="flex min-h-screen flex-col items-center justify-between p-24">
//           <h1>Hello</h1>
//           <button id="login-button" onClick={handleLogin}>Login with NEAR Wallet</button>
//           <button id="transfer-button" onClick={handleTransfer}>Transfer 1 NEAR</button>
//         </main>
//     );
