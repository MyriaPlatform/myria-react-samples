import React, { useState, useRef } from "react";
import { MyriaClient } from "myria-core-sdk";
import { burnERC20 } from "../samples/erc20/burn-erc20";
import Web3 from "web3";

type Props = {
  account: string;
  client: MyriaClient;
  isConnected: boolean;
};

const BurnERC20Token = ({
  account,
  client,
  isConnected,
}: Props) => {
  const [contractAddress, setContractAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("0.001");
  const [errorAction, setErrorAction] = useState<string | undefined>(undefined);

  const refContractAddress = useRef<HTMLInputElement>();
  const refAmount = useRef<HTMLInputElement>();

  const onContractAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContractAddress(event.target.value);
  };

  const onBurnToken = async () => {
    try {
      if (contractAddress.length < 1 || !Web3.utils.isAddress(contractAddress)) {
        refContractAddress.current.focus();
        setErrorAction(contractAddress.length === 0 ? "Contract Address is Required !" : "Contract Address invalid!");
        return;
      } else if (account.length < 1) {
        refAmount.current.focus();
        setErrorAction("Amount is Required !");
        return;
      } else
        return await burnERC20(
          client,
          account,
          contractAddress,
          account,
        );
    } catch {
      setErrorAction("Transfer ERC20 error !");
    }
  };

  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  return (
    <div className="list-form p-4 mt-3">
      <h4 className="text-white">Burn Tokens</h4>
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
            onClick={() => onBurnToken()}
            className={`btn-mry font-weight-bold ${
              isConnected ? "bg-warning text-dark" : "btn-secondary text-muted"
            }`}
            disabled={!isConnected}
          >
            Burn Tokens
          </button>
        </div>
      </div>
    </div>
  );
};

export default BurnERC20Token;
