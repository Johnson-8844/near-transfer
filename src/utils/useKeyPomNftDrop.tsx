import { useContext, useState } from 'react';
import { utils } from 'near-api-js';
import { KeyPair } from 'near-api-js/lib/utils';
import { NearContext } from '@/wallets/WalletSelector';

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
            const NFT_TOKEN_ID = "566";
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

    const createDrop = async (pubKeys: any) => {
        if (!wallet) {
            throw new Error("Wallet is undefined");
        }

        const KEYPOM_CONTRACT_ADDRESS = "v2.keypom.testnet";
        const NFT_CONTRACT_ADDRESS = "minsta.mintspace2.testnet";
        const DROP_AMOUNT = "10000000000000000000000";
        setLoading(true);

        try {
            const res = await wallet.callMethod({
                method: "create_drop",
                contractId: KEYPOM_CONTRACT_ADDRESS,
                args: {
                    public_keys: pubKeys,
                    deposit_per_use: DROP_AMOUNT,
                    nft: {
                        // Who will be sending the NFTs to the Keypom contract
                        sender_id: signedAccountId, // TODO How to get it
                        // NFT Contract Id that the tokens will come from
                        contract_id: NFT_CONTRACT_ADDRESS,
                    },
                },
                deposit: "23000000000000000000000", // state.publicKeys.length * dropAmount + 3000000000000000000000,
                gas: "100000000000000",
            });
            console.log("Ress >> ", res)
            return res;
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
            const KEYPOM_CONTRACT_ADDRESS = "v2.keypom.testnet";
            const NFT_CONTRACT_ADDRESS = "minsta.mintspace2.testnet";
            const NFT_TOKEN_ID = "556";
            const DROP_AMOUNT = "10000000000000000000000";

            const res = await wallet.callMethod({
                method: "nft_transfer_call",
                contractId: NFT_CONTRACT_ADDRESS,
                args: {
                    receiver_id: KEYPOM_CONTRACT_ADDRESS,
                    token_id: NFT_TOKEN_ID,
                    token_owner: signedAccountId,
                    msg: dropId.toString()
                },
                deposit: "1",
                gas: "100000000000000",
            });
            return res;
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
            const dropSupplyForOwner = await wallet?.viewMethod({
                contractId: KEYPOM_CONTRACT,
                method: 'get_next_drop_id',
                args: { account_id: accountId },
            });
            return dropSupplyForOwner;
        } catch (e: any) {
            console.error("Error fetching recent drop ID: ", e);
            throw e;
        }
    };

    return { mintNFT, createDrop, transferNFTToKeypom, getRecentDropId, loading, error };
};

export default useKeypomNFTDrop;
