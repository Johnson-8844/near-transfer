import * as nearAPI from "near-api-js";

type Payload = {
    receiver_id?: string,
    amount?: string,
};

export const getSignUrl = async (
    account_id: string,
    method: string,
    params: Payload,
    deposit: string,
    gas: string,
    receiver_id: string,
    meta: string,
    callback_url: string,
    network = "testnet"
): Promise<string | undefined> => {
    try {
        // const deposit_value = typeof deposit === 'string' ? deposit : nearAPI.utils.format.parseNearAmount('' + deposit);
        const deposit_value = deposit;
        console.log("Step 2 >>", deposit_value)
        const actions = [
            method === '!transfer'
                ? nearAPI.transactions.transfer(BigInt(deposit_value))
                : nearAPI.transactions.functionCall(
                    method,
                    Buffer.from(JSON.stringify(params)),
                    BigInt(gas),
                    BigInt(deposit_value)
                ),
        ];
        console.log("Step 3 >>", actions)
        const keypair = nearAPI.utils.KeyPair.fromRandom('ed25519');
        console.log("Step 4 >>", keypair)
        const provider = new nearAPI.providers.JsonRpcProvider({ url: `https://rpc.${network}.near.org` });
        console.log("Step 5 >>", provider)
        const block = await provider.block({ finality: 'final' });
        console.log("Step 6 >>", block)
        const txs = [
            nearAPI.transactions.createTransaction(
                account_id,
                keypair.getPublicKey(),
                receiver_id,
                1,
                actions,
                nearAPI.utils.serialize.base_decode(block.header.hash)
            ),
        ];
        console.log("Step 7 >>", txs)
        const newUrl = new URL('sign', `https://wallet.${network}.near.org/`);
        console.log("Step 8 >>", newUrl)
        newUrl.searchParams.set('transactions', txs.map(transaction => nearAPI.utils.serialize.serialize(nearAPI.transactions.SCHEMA['Transaction'], transaction)).map(serialized => Buffer.from(serialized).toString('base64')).join(','));
        newUrl.searchParams.set('callbackUrl', callback_url);
        if (meta) newUrl.searchParams.set('meta', meta);
        return newUrl.href;
    } catch (e) {
        console.error("Error creating sign URL", e);
        return;
    }
};