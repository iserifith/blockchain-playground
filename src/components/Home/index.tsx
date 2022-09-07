import Link from "next/link";
import React from "react";
import {
  AccountStateContextInterface,
  useAccountStore,
} from "../../helpers/useAccountStore";

const Home = () => {
  const { accountState, connectWallet } =
    useAccountStore() as AccountStateContextInterface;

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
      <div className="absolute inset-0 bg-[url(/img/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-xl sm:rounded-lg sm:px-10">
        <div className="mx-auto max-w-md text-center">
          <p className="text-2xl font-mono">dApps</p>
          {accountState?.connected ? (
            <div className="text-left">
              <p> Address: {accountState.walletAddress}</p>
              <p> Balance: {accountState.walletBalance}</p>
              <Link href="/chatrooms">
                <p className="p-2 bg-sky-400 cursor-pointer text-white my-2">
                  Chatrooms
                </p>
              </Link>
              <Link href="/">
                <p className="p-2 bg-sky-400 cursor-pointer text-white my-2">
                  NFT Marketplace (Unavailable)
                </p>
              </Link>
              <Link href="/">
                <p className="p-2 bg-sky-400 cursor-pointer text-white my-2">
                  WordleNFT (Unavailable)
                </p>
              </Link>
            </div>
          ) : (
            <div>
              <button onClick={connectWallet}>Connect Wallet</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
