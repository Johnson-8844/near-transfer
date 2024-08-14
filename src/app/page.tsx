"use client"
import WalletActions from "@/components/WalletActions";
import '@near-wallet-selector/modal-ui/styles.css';


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