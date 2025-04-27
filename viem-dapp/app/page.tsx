"use client";

import { useState } from "react";
import WalletConnect from "./components/WalletConnect";
import ReadContract from "./components/ReadContract";
import WriteContract from "./components/WriteContract";
import DeployLuggageContract from './components/DeployLuggageContract';


export default function Home() {
  const [account, setAccount] = useState<string | null>(null);

  const handleConnect = (connectedAccount: string) => {
    setAccount(connectedAccount);
  };

  return (
    <section className="min-h-screen bg-white text-black flex flex-col justify-center items-center gap-4 py-10">
      <h1 className="text-2xl font-semibold text-center">
        Baggage Tracker
      </h1>
      <WalletConnect onConnect={handleConnect} />
      <ReadContract />
      {/*<div style={{ textAlign: 'center', padding: 50 }}>
      <h1>Moonbeam Luggage Tracker</h1>
      <DeployLuggageContract />
      </div>*/}
      <WriteContract account={account} />
    </section>
  );
}