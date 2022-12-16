import { MyriaClient } from 'myria-core-sdk';
import WalletView from './Wallet';

type Props = {
  isConnected: boolean,
  account: string,
  starkKey: string,
  client: MyriaClient
}

const Main = ({ isConnected, account, starkKey, client }: Props) => {
  const renderWalletView = (
    <WalletView
      isConnected={isConnected}
      account={account}
      starkKey={starkKey}
      client={client}
    />
  );

  return (
    <div>
      {renderWalletView}
    </div>
  );
}

export default Main;