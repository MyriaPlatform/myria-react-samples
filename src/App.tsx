import { useEffect } from 'react';
import useMetamask from './helpers/useMetamask';
import AssetsView from './views/AssetsView';
import WalletView from './views/WalletView';
import Navbar from './components/navbar';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/styles.css';

function App() {
  const navbarItems = [
    {
      title: "Wallet",
      url: "/"
    },
    {
      title: "Assets",
      url: "/"
    },
    {
      title: "Withdrawals",
      url: "/"
    }
  ];

  function onConnectWallet() {
    console.log("test");
  }

  const { isConnected, checkIfMetaMaskInstalled, checkIfMetaMaskConnected, account } = useMetamask();

  useEffect(() => {
    checkIfMetaMaskInstalled();
  }, []);

  const renderAssetsView = (
    !isConnected ? (
      null
    ) : (
      <AssetsView
        isConnected={isConnected}
        account={account}
      />)
  );
  const renderWalletView = (
    <WalletView
      isConnected={isConnected}
      account={account} />
  );

  return (
    <div>
      <Navbar
        title="Myria React Samples"
        items={navbarItems}
        onButtonClick={checkIfMetaMaskConnected}
      />
      <div className="container mx-auto mt-3">
        {renderWalletView}
        {renderAssetsView}
      </div>
    </div>
  );
}

export default App;
