import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomeView from "./views/Main";
import useMetamask from "./helpers/useMetamask";
import Navbar from "./components/navbar";
import AssetsView from "./views/Assets";
import WithdrawalsView from "./views/Withdrawals";
import WalletView from "./views/Wallet";
import 'bootstrap/dist/css/bootstrap.css';
import './assets/styles.css';

function App() {
  const { isConnected, checkIfMetaMaskInstalled, checkIfMetaMaskConnected, account } = useMetamask();

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
  }, []);

  return (
    <div>
      <Navbar
        title="Myria React Samples"
        items={navbarItems}
        onButtonClick={checkIfMetaMaskConnected}
        buttonTitle= { isConnected ? "Wallet Connected" : "Connect Wallet" }
      />
      <div className="container mx-auto mt-3">
        <Routes>
          <Route path="/" element={<HomeView isConnected={isConnected} account={account} />} />
          <Route path="/wallet" element={<WalletView isConnected={isConnected} account={account} />} />
          <Route path="/assets" element={<AssetsView isConnected={isConnected} account={account} />} />
          <Route path="/withdrawals" element={<WithdrawalsView />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
