import WalletView from './Wallet';

type Props = {
  isConnected: boolean,
  account: string,
  starkKey: string
}

const Main = ({ isConnected, account, starkKey }: Props) => {
  const renderWalletView = (
    <WalletView
      isConnected={isConnected}
      account={account}
      starkKey={starkKey}
    />
  );

  return (
    <div>
      {renderWalletView}
    </div>
  );
}

export default Main;