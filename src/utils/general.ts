interface Wallet {
    viewMethod: (args: { contractId: string; method: string; args?: object }) => Promise<any>;
    callMethod: (args: { contractId: string; method: string; args?: object; gas?: string; deposit?: string }) => Promise<any>;
  }
  
  interface Drop {
    drop_id: string;
    [key: string]: any;
  }
  
  export const getRecentDropId = async (
    wallet: Wallet,
    accountId: string,
    keypomContract: string
  ): Promise<string> => {
    // Ensure the wallet has the appropriate viewMethod
    const viewMethod = wallet.viewMethod;
    if (!viewMethod) {
      throw new Error("Wallet does not have a viewMethod");
    }
  
    // Get the drop supply for the owner
    const dropSupplyForOwner: number = await viewMethod({
      contractId: keypomContract,
      method: 'get_drop_supply_for_owner',
      args: { account_id: accountId },
    });
    console.log('dropSupplyForOwner: ', dropSupplyForOwner);
  
    // Get the drops for the owner
    const dropsForOwner: Drop[] = await viewMethod({
      contractId: keypomContract,
      method: 'get_drops_for_owner',
      args: { 
        account_id: accountId, 
        from_index: (dropSupplyForOwner - 1).toString(),
      },
    });
    console.log('dropsForOwner: ', dropsForOwner);
  
    // Return the most recent drop ID
    return dropsForOwner[dropsForOwner.length - 1].drop_id;
  };
  