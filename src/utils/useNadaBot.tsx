import { useContext, useState } from "react";
import { NearContext } from "@/wallets/WalletSelector";

const useNadaBot = () => {
  const { wallet } = useContext(NearContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHuman = async (accountId: string) => {
    setLoading(true);
    try {
      if (!wallet) {
        throw new Error("Wallet is undefined");
      }

      const contractId = "v1.nadabot.testnet";
      
      const isHuman = await wallet.viewMethod({
        contractId,
        method: "is_human",
        args: { account_id: accountId },
      });

      console.log("Is Human:", isHuman);
      return isHuman;
    } catch (error: any) {
      setError(error?.message || "An error occurred while checking human verification.");
      console.error("checkHuman Error >>", error);
      throw new Error(error?.message || "An error occurred during the human verification process.");
    } finally {
      setLoading(false);
    }
  };

  const humanScore = async (accountId: string) => {
    setLoading(true);
    try {
      if (!wallet) {
        throw new Error("Wallet is undefined");
      }

      const contractId = "v1.nadabot.testnet";
      
      const scoreResponse = await wallet.viewMethod({
        contractId,
        method: "get_human_score",
        args: { account_id: accountId },
      });

      console.log("Human Score:", scoreResponse.score);
      return scoreResponse.score;
    } catch (error: any) {
      setError(error?.message || "An error occurred while fetching the human score.");
      console.error("humanScore Error >>", error);
      throw new Error(error?.message || "An error occurred during the human score fetching process.");
    } finally {
      setLoading(false);
    }
  };

  return { checkHuman, humanScore, loading, error };
};

export default useNadaBot;
