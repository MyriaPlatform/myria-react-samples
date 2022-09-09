type Props = {
  isConnected: boolean,
  account: string,
  starkKey: string
}

const Wallet = ({ isConnected, account, starkKey }: Props) => {
  return (
    <div>
      <div className="margin-bottom--sm">
        Wallet status: {isConnected ? "connected" : "not connected"}
      </div>
      <div className="margin-bottom--sm">Wallet address: {account}</div>
      <div>Stark Key: {starkKey}</div>
    </div>
  );
}

export default Wallet;
