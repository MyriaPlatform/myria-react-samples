import React, { useState, useRef } from "react";
import { MyriaClient } from "myria-core-sdk";
import { transferERC20 } from "../samples/erc20/transfer-erc20";
import Web3 from "web3";

type Props = {
  account: string;
  client: MyriaClient;
  isConnected: boolean;
};

const TransferERC20Token = ({
  account,
  client,
  isConnected,
}: Props) => {
  const [receiverWalletAddress, setReceiverWalletAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [errorAction, setErrorAction] = useState<string | undefined>(undefined);

  const refReceiverWalletAddress = useRef<HTMLInputElement>();
  const refAmount = useRef<HTMLInputElement>();

  const onReceiverAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReceiverWalletAddress(event.target.value);
  };

  const onTransfer = async () => {
    try {
      if (receiverWalletAddress.length < 1 || (!Web3.utils.isAddress(receiverWalletAddress))) {
        refReceiverWalletAddress.current.focus();
        setErrorAction(receiverWalletAddress.length === 0 ? "Receiver Wallet Address is Required !" : "Receiver Wallet Address invalid !");
        return;
      } else if (amount.length < 1) {
        refAmount.current.focus();
        setErrorAction("Amount is Required !");
        return;
      } else
        return await transferERC20(
          client,
          account,
          receiverWalletAddress,
          amount
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
      <h4 className="text-white">Transfer Tokens</h4>
      <div className="form-row mt-3">
        <div className="col">
          <input
            type="text"
            value={receiverWalletAddress}
            onChange={onReceiverAddressChange}
            name="receiverWalletAddress"
            className="form-control"
            placeholder="Receiver Wallet address"
            onFocus={() => setErrorAction(undefined)}
            ref={refReceiverWalletAddress}
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
            onClick={() => onTransfer()}
            className={`btn-mry font-weight-bold ${
              isConnected ? "bg-warning text-dark" : "btn-secondary text-muted"
            }`}
            disabled={!isConnected}
          >
            Transfer Tokens
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferERC20Token;
