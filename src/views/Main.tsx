import WalletView from './Wallet';

type Props = {
  isConnected: boolean,
  account: string,
}

const Main = ({ isConnected, account }: Props) => {
  const renderWalletView = (
    <WalletView
      isConnected={isConnected}
      account={account} />
  );

  return (
    <div>
      {renderWalletView}
    </div>
  );
}

export default Main;