import { MyriaClient } from "myria-core-sdk";
import DepositERC20Token from "../components/DepositERC20Token";
import WithDrawERC20Token from "../components/WithDrawERC20Token";
import TransferERC20Token from "../components/TransferERC20Token";
import BurnERC20Token from "../components/BurnERC20Token";

type Props = {
  isConnected: boolean,
  account: string,
  starkKey: string
  client: MyriaClient
}

const Wallet = ({ isConnected, account, starkKey, client }: Props) => {


  return (
    <div className="container">
      <div className="row flex-column">
        <div className="list-form p-4 mt-3">
          <h4 className="text-white">Wallet Info</h4>
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
        <DepositERC20Token isConnected={isConnected} account={account} starkKey={starkKey} client={client} />
        <WithDrawERC20Token isConnected={isConnected} account={account} starkKey={starkKey} client={client} />
        <TransferERC20Token isConnected={isConnected} account={account} client={client} />
        <BurnERC20Token isConnected={isConnected} account={account} client={client} />
      </div>
    </div>
  );
}

export default Wallet;
