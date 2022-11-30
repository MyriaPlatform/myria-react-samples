import { MyriaClient } from "myria-core-sdk";
import { useState } from "react";
import { depositErc20 } from "../samples/erc20/deposit-erc20";

type Props = {
  isConnected: boolean,
  account: string,
  starkKey: string
  client: MyriaClient
}

const Wallet = ({ isConnected, account, starkKey, client }: Props) => {
  const [contractAddress, setContractAddress] = useState<any>("0xA06116D9E28AF403d6989c45EF8C0b9B971e5E12");
  const [amount, setAmount] = useState<any>("5");

  const onDeposit = async () => {
    return await depositErc20(client, starkKey, account, contractAddress, amount);
  }

  const onContractAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContractAddress(event.target.value);
  };

  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-7 list-form py-3 mt-3">
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
      </div>
      <div className="row">
        <div className="col-7 list-form py-3 mt-3">
          <h4 className="text-white">Deposit tokens</h4>
          <div className="form-row">
            <div className="col">
              <input type="text" value={contractAddress} onChange={onContractAddressChange} name="contractAddress" className="form-control" placeholder="Erc20 contract address" />
            </div>
            <div className="col">
              <input type="text" value={amount} onChange={onAmountChange} name="amount" className="form-control" placeholder="Amount" />
            </div>
            <div className="col">
              <button onClick={() => onDeposit()} className="btn-mry">Deposit tokens</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
