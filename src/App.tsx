import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomeView from "./views/Main";
import useMetamask from "./helpers/useMetamask";
import Navbar from "./components/navbar";
import AssetsView from "./views/Assets";
import WithdrawalsView from "./views/Withdrawals";
import WalletView from "./views/Wallet";
import { DeveloperAccountManager } from "myria-core-sdk";
import { getMyriaClient } from "./samples/common/myria-client";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./assets/styles.css";

function App() {
  const { isInstalled, isConnected, checkIfMetaMaskInstalled, checkIfMetaMaskConnected, account } = useMetamask();
  const [starkKey, setStarkKey] = useState("0x");
  const [client, setClient] = useState(null);

  const navbarItems = [
    {
      title: "Wallet",
      url: "/wallet"
    },
    {
      title: "Assets",
      url: "/assets"
    },
    {
      title: "Withdrawals",
      url: "/withdrawals"
    }
  ];

  useEffect(() => {
    checkIfMetaMaskInstalled();
    if(isInstalled) {
      checkIfMetaMaskConnected().then(() => {
        if (isConnected) {
          const setKey = async () => {
            try {
              const client = await getMyriaClient(isConnected);
              setClient(client);

              const devAccountManager: DeveloperAccountManager = new DeveloperAccountManager(client);
              const starkKey = (await devAccountManager.getUserByWalletAddress(account)).starkKey;
              setStarkKey(starkKey);
            } catch (err: any) {
              console.log(err);
            }
          }
          setKey();
        }
      })
    }
  }, [account, isConnected]);

  return (
    <div>
      <Navbar
        title="Myria React Samples"
        items={navbarItems}
        onButtonClick={checkIfMetaMaskConnected}
        buttonTitle={isConnected ? "Wallet Connected" : "Connect Wallet"}
      />
      <div className="container mx-auto mt-3">
        <Routes>
          <Route path="/" element={<HomeView isConnected={isConnected} account={account} starkKey={starkKey} />} />
          <Route path="/wallet" element={<WalletView isConnected={isConnected} account={account} starkKey={starkKey} />} />
          <Route path="/assets" element={<AssetsView isConnected={isConnected} account={account} starkKey={starkKey} client={client} />} />
          <Route path="/withdrawals" element={<WithdrawalsView isConnected={isConnected} account={account} starkKey={starkKey} client={client} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
