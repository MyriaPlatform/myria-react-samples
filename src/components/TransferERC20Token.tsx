import React, { useState, useRef } from "react";
import { MyriaClient } from "myria-core-sdk";
import {
  myriaTokenAddress,
  transferERC20,
} from "../samples/erc20/transfer-erc20";
import Web3 from "web3";
import { toast } from "react-toastify";

type Props = {
  account: string;
  client: MyriaClient;
  isConnected: boolean;
};

const TransferERC20Token = ({ account, client, isConnected }: Props) => {
  const [receiverWalletAddress, setReceiverWalletAddress] =
    useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [inputTokenAddress, setInputTokenAddress] =
    useState<string>(myriaTokenAddress);
  const [errorAction, setErrorAction] = useState<string | undefined>(undefined);

  const refReceiverWalletAddress = useRef<HTMLInputElement>();
  const refAmount = useRef<HTMLInputElement>();
  const refTokenAddress = useRef<HTMLInputElement>();

  const onReceiverAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReceiverWalletAddress(event.target.value);
  };

  const onTokenAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTokenAddress(event.target.value);
  };

  const onTransfer = async () => {
    try {
      if (
        receiverWalletAddress.length < 1 ||
        !Web3.utils.isAddress(receiverWalletAddress)
      ) {
        refReceiverWalletAddress.current.focus();
        setErrorAction(
          receiverWalletAddress.length === 0
            ? "Receiver Wallet Address is Required !"
            : "Receiver Wallet Address invalid !"
        );
        return;
      } else if (
        inputTokenAddress.length < 1 ||
        !Web3.utils.isAddress(inputTokenAddress)
      ) {
        refTokenAddress.current.focus();
        setErrorAction(
          inputTokenAddress.length === 0
            ? "Token Address is Required !"
            : "Token Address invalid !"
        );
        return;
      } else if (amount.length < 1) {
        refAmount.current.focus();
        setErrorAction("Amount is Required !");
        return;
      } else {
        await transferERC20(
          client,
          account,
          receiverWalletAddress,
          inputTokenAddress,
          amount
        );
        toast("Transfer success !", { type: "success" });
      }
    } catch {
      toast("Transfer failed !", { type: "error" });
    }
  };

  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  return (
    <div className="list-form p-4 mt-3">
      <h4 className="text-white">Transfer Token</h4>
      <div className="form-row mt-3">
        <p className="mb-2 fs-6">Sample Myria Token Address (Testnet)</p>
        <div className="col">
          <input
            type="text"
            value={inputTokenAddress}
            onChange={onTokenAddressChange}
            name="contractAddress"
            className="form-control"
            placeholder="Token address"
            onFocus={() => setErrorAction(undefined)}
            ref={refTokenAddress}
          />
        </div>
        <div className="col mt-4">
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
            className={`btn-mry fw-bold ${
              isConnected ? "bg-warning text-dark" : "btn-secondary text-muted"
            }`}
            disabled={!isConnected}
          >
            Transfer Token
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferERC20Token;
