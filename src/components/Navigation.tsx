import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';

// import { NearContext } from '@/context';
import NearLogo from '/public/next.svg';
import { NearContext } from '@/wallets/WalletSelector';

interface Wallet {
    startUp: (accountChangeHook: (signedAccountId: string) => void) => Promise<string>;
    viewMethod: (options: { contractId: string; method: string; args?: object }) => Promise<any>;
    callMethod: (options: { contractId: string; method: string; args?: object; gas?: string; deposit?: string }) => Promise<any>;
    getTransactionResult: (txhash: string) => Promise<any>;
    signIn: () => void;
    signOut: () => Promise<void>;
}

export const Navigation: React.FC = () => {
    // as { signedAccountId: string | null; wallet: Wallet | null }
    const { signedAccountId, wallet } = useContext(NearContext);
    //   const [action, setAction] = useState<() => void>(() => () => {});
    // const [label, setLabel] = useState<string>('Loading...');
    const [currentNearAmount, setCurrentNearAmount] = useState(0);
    useEffect(() => {
        if (!wallet || !signedAccountId) return;

        const loadBalance = async () => {
            try {
                const balance = await wallet.getBalance(signedAccountId);
                const requiredGas = 0.00005;
                setCurrentNearAmount(balance - requiredGas);
            } catch (error) {
                console.error(error);
            }
        };

        loadBalance();
    }, [wallet, signedAccountId]);

    const signIn = () => {
        if (!wallet) return;
        wallet.signIn();
    }

    const signOut = () => {
        if (!wallet) return;
        wallet.signIn();
    }

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid flex gap-5">
                <Link href="/" passHref legacyBehavior>
                    <Image priority src={NearLogo} alt="NEAR" width="30" height="24" className="d-inline-block align-text-top" />
                </Link>
                <div className='navbar-nav pt-1'>
                    <div className="balance">
                        <h2>Balance : {currentNearAmount}</h2>
                    </div>
                    {signedAccountId ? (
                        <div>
                            <h2>Acc : {signedAccountId}</h2>
                            <button className="btn btn-secondary" onClick={signOut}>Logout</button>
                        </div>
                    ) : (
                        <button className="btn btn-secondary" onClick={signIn}>Login</button>
                    )}
                </div>
            </div>
        </nav>
    );
};
