type Props = {
  isConnected: boolean,
  account: string,
}

function WalletView({ isConnected, account }: Props) {

  return (
    <div>
      <div className="margin-bottom--sm">
        Status: {isConnected ? "connected" : "not connected"}
      </div>
      <div className="margin-bottom--sm">Account: {account}</div>
    </div>
  );
}

export default WalletView;
