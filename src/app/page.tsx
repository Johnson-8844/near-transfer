// 'use client';  // This line ensures the component is rendered only on the client side
// import { useEffect, useState } from "react";
// import { setupWalletSelector } from "@near-wallet-selector/core";
// import { setupModal } from "@near-wallet-selector/modal-ui";
// import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
// import { setupSender } from "@near-wallet-selector/sender";
// // import { setupNearFi } from "@near-wallet-selector/nearfi";
// import { setupHereWallet } from "@near-wallet-selector/here-wallet";
// // import { setupMathWallet } from "@near-wallet-selector/math-wallet";
// import { setupNightly } from "@near-wallet-selector/nightly";
// import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
// import { setupLedger } from "@near-wallet-selector/ledger";
// import { setupMintbaseWallet } from '@near-wallet-selector/mintbase-wallet';
// // import { setupCoin98Wallet } from "@near-wallet-selector/coin98-wallet";
// import "@near-wallet-selector/modal-ui/styles.css";
// import { WalletProvider } from "@/providers/WalletProvider";
// import WalletActions from "@/components/WalletActions";
// export default function Home() {
//   return (
//   <WalletProvider>
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div>
//         <h1>NEAR Wallet Example</h1>
//         <WalletActions />
//       </div>
//     </main>
//   </WalletProvider>
// );
// }

// =======================================================================
// sathish method

'use client';  // This line ensures the component is rendered only on the client side
import { useEffect, useState } from "react";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
// import { setupNearFi } from "@near-wallet-selector/nearfi";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
// import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMintbaseWallet } from '@near-wallet-selector/mintbase-wallet';
// import { setupCoin98Wallet } from "@near-wallet-selector/coin98-wallet";
import "@near-wallet-selector/modal-ui/styles.css";
export default function Home() {
  const [selector, setSelector] = useState(null);
  const [modal, setModal] = useState(null);
  const [account, setAccount] = useState(null);  // State to hold the connected account
  useEffect(() => {
    const initializeWalletSelector = async () => {
      try {
        const selectorInstance = await setupWalletSelector({
          network: "testnet",
          modules: [
            setupMintbaseWallet({
              walletUrl:  'https://testnet.wallet.mintbase.xyz',
              callbackUrl:  'https://minsta.org',
              deprecated:  false,
            }),
            setupMyNearWallet(),
            setupSender(),
            setupHereWallet(),
            setupNightly(),
            setupMeteorWallet(),
            setupLedger(),
          ],
        });
        const modalInstance = setupModal(selectorInstance, {
          contractId: "test.testnet",
        });
        setSelector(selectorInstance);
        setModal(modalInstance);
      } catch (error) {
        console.error("Failed to initialize wallet selector:", error);
      }
    };
    initializeWalletSelector();
  }, []);
  const handleSign = async () => {
    if (!selector) {
      console.error("Wallet selector is not initialized.");
      return;
    }
    if (modal) {
      try {
        modal.show();
        const wallet = await selector.wallet();
        if (!wallet) {
          console.error("No wallet found.");
          return;
        }
        const response = await wallet.signIn({ contractId: "test.testnet" });
        // Extract the accountId if the response is an object
        console.log(response[0].accountId);
        setAccount(response[0].accountId);
         // Update the state with the connected account ID
      } catch (error) {
        console.error("Failed to sign in:", error);
      }
    } else {
      console.error("Modal is not initialized.");
    }
  };
  const handleSend = async () => {
    const wallet = await selector.wallet();
    if (!wallet) {
      console.error("Wallet is not connected.");
      return;
    }
    try {
      const transaction = await wallet.signAndSendTransaction({
        signerId: account,
        receiverId: "rapid_zuckerberg.testnet",
        actions: [
          {
            type: "Transfer",
            params: {
              deposit: "1000000000000000000000", // 1 NEAR
            },
          },
        ],
      });
      console.log("Transaction sent:", transaction);
    } catch (error) {
      console.error("Failed to send transaction:", error);
    }
  };
  return (
    <div>
      <button onClick={handleSign} className="mt-10 ml-20 rounded-lg w-20 h-10 bg-white text-black">
        Connect
      </button>
      {account && (
        <div className="mt-4 ml-20">
          <p className="text-white">Connected Account: {account}</p>
        </div>
      )}
     <button onClick={handleSend} className="mt-10 ml-20 rounded-lg w-20 h-10 bg-white text-black">
       send
      </button>
    </div>
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


// =================================================================================================
// New Wallet Selector with action Transfer

// return (
//   <WalletProvider>
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div>
//         <h1>NEAR Wallet Example</h1>
//         <WalletActions />
//       </div>
//     </main>
//   </WalletProvider>
// );
