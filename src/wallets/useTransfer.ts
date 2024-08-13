import { useMbWallet } from "@mintbase-js/react";
import { useState } from "react";
import * as nearAPI from "near-api-js";

const useTransfer = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { selector, activeAccountId } = useMbWallet();

    const getWallet = async () => {
        try {
            return await selector.wallet();
        } catch (error) {
            console.error("Failed to retrieve the wallet:", error);
            setLoading(false);
            throw new Error("Failed to retrieve the wallet");
        }
    };

    const transfer = async (receiverId: string) => {
        if (!activeAccountId) {
            setError("Active account ID is not set.");
            return;
        }
        setLoading(true);

        try {
            const wallet = await getWallet();

            console.log("Active Account ID:", activeAccountId);
            console.log("Receiver ID:", receiverId);
            const amountInYocto = nearAPI.utils.format.parseNearAmount("0.05");

            const transaction = await wallet.signAndSendTransaction({
                receiverId: "sweety08.testnet",
                actions: [
                    {
                        type: 'Transfer',
                        params: {
                            deposit: amountInYocto as string
                        },
                    },
                ],
            });
            console.log("Step 5 >>", transaction)
            return transaction;

        } catch (error: any) {
            setError(
                error?.message || "An error occurred during the transaction process."
            );
            console.log("Error >> ", error)
        } finally {
            setLoading(false);
        }
    }

    return { transfer, loading, error };

}

export default useTransfer;