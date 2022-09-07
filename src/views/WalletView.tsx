type Props = {
  isConnected: boolean,
  account: string,
}

function WalletView({ isConnected, account }: Props) {

  return (
    <div>
      <div className="margin-bottom--sm">
        Wallet status: {isConnected ? "connected" : "not connected"}
      </div>
      <div className="margin-bottom--sm">Wallet address: {account}</div>
    </div>
  );
}

export default WalletView;
