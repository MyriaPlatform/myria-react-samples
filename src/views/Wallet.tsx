type Props = {
  isConnected: boolean,
  account: string,
  starkKey: string
}

const Wallet = ({ isConnected, account, starkKey }: Props) => {
  return (
    <div className="table-responsive">
      <table className="table">
        <tbody>
          <tr>
            <td>Wallet Status</td>
            <td>{isConnected ? "connected" : "not connected"}</td>
          </tr>
          <tr>
            <td>Wallet Address</td>
            <td>{account}</td>
          </tr>
          <tr>
            <td>Stark Key</td>
            <td>{starkKey}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Wallet;
