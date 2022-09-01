import { useEffect } from 'react';
import useMetamask from '../helpers/useMetamask';
import AssetsView from '../views/AssetsView';
import MetamaskView from '../views/MetamaskView';
import WithdrawNftView from '../views/WithdrawNftView';
import '../assets/styles.css';

function App() {
  const { isConnected, checkIfMetaMaskInstalled, checkIfMetaMaskConnected, account } = useMetamask();

  useEffect(() => {
    checkIfMetaMaskInstalled();
  });

  return (
    <div>
      <MetamaskView
        isConnected={isConnected}
        checkIfMetaMaskConnected={checkIfMetaMaskConnected}
        account={account} />
      <AssetsView
        isConnected={isConnected}
        account={account}
      />
      <WithdrawNftView isConnected={isConnected} />
    </div>
  );
}

export default App;
