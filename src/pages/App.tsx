import { useEffect } from 'react';
import useMetamask from '../helpers/useMetamask';
import AssetsView from '../views/AssetsView';
import WalletView from '../views/WalletView';
import '../assets/styles.css';

function App() {
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
    !isConnected ? (
      <h2>Wallet is not connected</h2>
    ) : (
      <WalletView
        isConnected={isConnected}
        account={account}
      />)
  );

  return (
    <div className="container mx-auto my-4">
      <button
        type="button"
        className="mr-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        onClick={checkIfMetaMaskConnected}
      >
        {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
      </button>
      {renderWalletView}
      {renderAssetsView}
    </div>
  );
}

export default App;
