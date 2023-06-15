import React, { useState, useRef } from "react";
import { depositErc20 } from "../samples/erc20/deposit-erc20";
import { MyriaClient } from "myria-core-sdk";
import Web3 from "web3";
import { toast } from "react-toastify";

type Props = {
  account: string;
  starkKey: string;
  client: MyriaClient;
  isConnected: boolean;
};

const DepositERC20Token = ({
  account,
  starkKey,
  client,
  isConnected,
}: Props) => {
  const [contractAddress, setContractAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [errorAction, setErrorAction] = useState<string | undefined>(undefined);

  const refContractAddress = useRef<HTMLInputElement>();
  const refAmount = useRef<HTMLInputElement>();

  const onContractAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContractAddress(event.target.value);
  };

  const onDeposit = async () => {
    try {
      if (
        contractAddress.length < 1 ||
        !Web3.utils.isAddress(contractAddress)
      ) {
        refContractAddress.current.focus();
        setErrorAction(
          contractAddress.length === 0
            ? "Contract Address is Required !"
            : "Contract Address invalid !"
        );
        return;
      } else if (amount.length < 1) {
        refAmount.current.focus();
        setErrorAction("Amount is Required !");
        return;
      } else {
        await depositErc20(client, starkKey, account, contractAddress, amount);
        toast("Deposit success !", { type: "success" });
      }
    } catch {
      toast("Deposit failed !", { type: "error" });
    }
  };

  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  return (
    <div className="list-form p-4 mt-3">
      <h4 className="text-white">Deposit Token</h4>
      <div className="form-row mt-3">
        <div className="col">
          <input
            type="text"
            value={contractAddress}
            onChange={onContractAddressChange}
            name="contractAddress"
            className="form-control"
            placeholder="ERC20 contract address"
            onFocus={() => setErrorAction(undefined)}
            ref={refContractAddress}
          />
        </div>
        <div className="col mt-2">
          <input
            type="text"
            value={amount}
            onChange={onAmountChange}
            name="amount"
            className="form-control"
            placeholder="Amount"
            onFocus={() => setErrorAction(undefined)}
            ref={refAmount}
          />
        </div>
        {errorAction ? <span className="text-error">{errorAction}</span> : null}
        <div className="col mt-4">
          <button
            onClick={() => onDeposit()}
            className={`btn-mry fw-bold ${
              isConnected ? "bg-warning text-dark" : "btn-secondary text-muted"
            }`}
            disabled={!isConnected}
          >
            Deposit Token
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositERC20Token;
