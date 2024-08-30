import { NearContext } from "@/wallets/WalletSelector";
import { useContext } from "react";

const useGeneral = () => {

  const { wallet, signedAccountId } = useContext(NearContext);
  const getRecentDropId = async (accountId: string) => {

    try {
        const KEYPOM_CONTRACT = "v2.keypom.testnet";
  
        // Get the total drop supply for the owner
        const dropSupplyForOwner = await wallet?.viewMethod({
            contractId: KEYPOM_CONTRACT,
            method: 'get_drop_supply_for_owner',
            args: { account_id: accountId },
        });
        console.log('dropSupplyForOwner: ', dropSupplyForOwner);
  
        // Get the drops for the owner, starting from the last drop
        const dropsForOwner = await wallet?.viewMethod({
            contractId: KEYPOM_CONTRACT,
            method: 'get_drops_for_owner',
            args: { account_id: accountId, from_index: (dropSupplyForOwner - 1).toString() },
        });
        console.log('dropsForOwner: ', dropsForOwner);
  
        // Return the most recent drop ID
        return dropsForOwner[dropsForOwner.length - 1].drop_id;
    } catch (error) {
        console.error("Error fetching recent drop ID:", error);
        throw error;
    }
  };
  return {getRecentDropId}
}

export default useGeneral;
