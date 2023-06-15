import React, { useRef, useState } from "react";
import { withdrawERC20 } from "../samples/erc20/withdraw-erc20";
import { MyriaClient } from "myria-core-sdk";
import Web3 from "web3";
import { toast } from "react-toastify";
import { myriaTokenAddress } from "../samples/erc20/transfer-erc20";

type Props = {
  account: string;
  starkKey: string;
  client: MyriaClient;
  isConnected: boolean;
};

const WithDrawERC20Token = ({
  account,
  starkKey,
  client,
  isConnected,
}: Props) => {
  const [tokenAddress, setTokenAddress] = useState<string>(myriaTokenAddress);
  const [amount, setAmount] = useState<string>("");
  const [errorAction, setErrorAction] = useState<string | undefined>(undefined);

  const refTokenAddress = useRef<HTMLInputElement>();
  const refAmount = useRef<HTMLInputElement>();

  const onTokenAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(event.target.value);
  };

  const onWithDrawTokens = async () => {
    try {
      if (tokenAddress.length < 1 || !Web3.utils.isAddress(tokenAddress)) {
        refTokenAddress.current.focus();
        setErrorAction(tokenAddress.length === 0 ? "Token Address is Required !" : "Token Address invalid");
        return;
      } else if (amount.length < 1) {
        refAmount.current.focus();
        setErrorAction("Amount is Required !");
        return;
      }
      await withdrawERC20(client, starkKey, account, tokenAddress, amount);
      toast("Withdraw success !", {type: 'success'})
    } catch {
      toast("Withdraw failed !", {type: 'error'})
    }
  };
  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  return (
    <div className="list-form p-4 mt-3">
      <h4 className="text-white">Withdraw Token</h4>
      <div className="form-row mt-3">
      <p className="mb-2 fs-6">Sample Myria Token Address (Testnet)</p>
        <div className="col">
          <input
            type="text"
            value={tokenAddress}
            onChange={onTokenAddressChange}
            name="tokenAddress"
            className="form-control"
            placeholder="ERC20 Token Address"
            onFocus={() => setErrorAction(undefined)}
            ref={refTokenAddress}
          />
        </div>
        <div className="col mt-4">
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
        {errorAction ? <p className="text-error">{errorAction}</p> : null}
        <div className="col mt-2">
          <button
            onClick={() => onWithDrawTokens()}
            className={`btn-mry fw-bold ${
              isConnected ? "bg-warning text-dark" : "btn-secondary text-muted"
            }`}
            disabled={!isConnected}
          >
            Withdraw Token
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithDrawERC20Token;
