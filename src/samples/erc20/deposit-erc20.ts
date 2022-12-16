import { ConfirmationType, DepositERC20Params, DepositModule, MyriaClient, SendOptions } from "myria-core-sdk";
import { convertEthToWei } from "../common/convertEthToWei";

export async function depositErc20(client: MyriaClient, starkKey: string, account: string, contractAddress: string, amount: string) {
  const depositModule: DepositModule = new DepositModule(client);

  const params: DepositERC20Params = {
    starkKey: starkKey,
    contractAddress: contractAddress,
    amount: String(convertEthToWei(amount.toString())),
    ethAddress: account
  }

  const sendOptions: SendOptions = {
    from: account,
    confirmationType: ConfirmationType.Confirmed,
  }

  await depositModule.depositERC20(params, sendOptions).then((data) => {
    console.log(JSON.stringify(data, null, 2));
  });
}
