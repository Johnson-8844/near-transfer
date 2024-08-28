import { useContext, useState } from 'react';
import { utils } from 'near-api-js';
import { KeyPair } from 'near-api-js/lib/utils';
import { NearContext } from '@/wallets/WalletSelector';
import { createDrop } from '@keypom/core';
import { Account } from "@near-js/accounts";

const useKeypomNFTDrop = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dropLinks, setDropLinks] = useState<{ [key: string]: string } | null>(null);
    const { wallet, signedAccountId } = useContext(NearContext);

    const mintNFT = async () => {
        if (!wallet) {
            throw new Error("Wallet is undefined");
        }
        setLoading(true);

        try {
            const YOUR_ACCOUNT = signedAccountId;
            const NFT_TOKEN_ID = "keypom-token-" + Date.now().toString();
            const NFT_CONTRACT = "minsta.mintspace2.testnet";

            await wallet.callMethod({
                contractId: NFT_CONTRACT,
                method: 'nft_mint',
                args: {
                    receiver_id: YOUR_ACCOUNT,
                    metadata: {
                        title: "My Keypom NFT",
                        description: "Keypom is lit fam :D",
                        media: "https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqyhrdzlhvpt33dyjivufqusq.ipfs.dweb.link/goteam-gif.gif",
                    },
                    token_id: NFT_TOKEN_ID,
                },
                gas: '300000000000000',
                deposit: utils.format.parseNearAmount("0.1")?.toString(),
            });

            return NFT_TOKEN_ID;
        } catch (e: any) {
            setError(e.message || "An error occurred while minting the NFT.");
            console.error("Error minting NFT: ", e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const createDrop = async (pubKeys: any, nftSenderId: string) => {
        if (!wallet) {
            throw new Error("Wallet is undefined");
        }
        setLoading(true);

        try {
            const KEYPOM_CONTRACT = "v2.keypom.testnet";
            const NFT_CONTRACT = "minsta.mintspace2.testnet";

            await wallet.callMethod({
                contractId: KEYPOM_CONTRACT,
                method: 'create_drop',
                args: {
                    public_keys:  pubKeys,
                    deposit_per_use: utils.format.parseNearAmount("1"),
                    nft: {
                        sender_id: nftSenderId,
                        contract_id: NFT_CONTRACT,
                    },
                },
                gas: '300000000000000',
                deposit: utils.format.parseNearAmount("1")?.toString(),
            });

            // const dropId = await getRecentDropId(nftSenderId);
            // console.log("Drop ID >>>> ", dropId)
            // return dropId;
            return;
        } catch (e: any) {
            setError(e.message || "An error occurred while creating the drop.");
            console.error("Error creating drop: ", e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const transferNFTToKeypom = async (nftTokenId: string, dropId: string, keyPairs: any[]) => {
        if (!wallet) {
            throw new Error("Wallet is undefined");
        }
        setLoading(true);

        try {
            const NFT_CONTRACT = "minsta.mintspace2.testnet";
            const KEYPOM_CONTRACT = "v2.keypom.testnet";

            await wallet.callMethod({
                contractId: NFT_CONTRACT,
                method: 'nft_transfer_call',
                args: {
                    receiver_id: KEYPOM_CONTRACT,
                    token_id: nftTokenId,
                    msg: dropId.toString(),
                },
                gas: '300000000000000',
                deposit: utils.format.parseNearAmount("1")?.toString(),
            });

            // Generate linkdrop URL
            const linkdropUrl = `https://testnet.mynearwallet.com/linkdrop/${KEYPOM_CONTRACT}/${dropId}`;
            setDropLinks((prevLinks) => ({ ...prevLinks, [dropId]: linkdropUrl }));
            return linkdropUrl;
        } catch (e: any) {
            setError(e.message || "An error occurred while transferring the NFT.");
            console.error("Error transferring NFT: ", e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const getRecentDropId = async (accountId: string) => {
        try {
            const KEYPOM_CONTRACT = "v2.keypom.testnet";
            // Fetch drop supply for the owner
            console.log(`Fetching drop supply for account: ${accountId}`);
            const dropSupplyForOwner = await wallet?.viewMethod({
                contractId: KEYPOM_CONTRACT,
                method: 'get_next_drop_id',
                args: { account_id: accountId },
            });
            return dropSupplyForOwner;
    
            // console.log(`Drop supply for ${accountId}:`, dropSupplyForOwner);
    
            // if (!dropSupplyForOwner || typeof dropSupplyForOwner !== 'number' || dropSupplyForOwner <= 0) {
            //     throw new Error("Invalid drop supply returned from contract");
            // }
    
            // // Fetch drops for the owner
            // console.log(`Fetching drops for account: ${accountId} starting from index: ${dropSupplyForOwner - 1}`);
            // const dropsForOwner = await wallet?.viewMethod({
            //     contractId: KEYPOM_CONTRACT,
            //     method: 'get_drops_for_owner',
            //     args: {
            //         account_id: accountId,
            //         from_index: (dropSupplyForOwner - 1).toString(),
            //     },
            // });
    
            // console.log(`Drops for ${accountId}:`, dropsForOwner);
    
            // if (!dropsForOwner || dropsForOwner.length === 0) {
            //     throw new Error("No drops found for the owner");
            // }
    
            // // Return the most recent drop ID
            // return dropsForOwner[dropsForOwner.length - 1].drop_id;
        } catch (e: any) {
            console.error("Error fetching recent drop ID: ", e);
            throw e;
        }
    };
    
    

    return { mintNFT, createDrop, transferNFTToKeypom, getRecentDropId, dropLinks, loading, error };
};

export default useKeypomNFTDrop;
