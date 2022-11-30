import { DepositERC20Params, DepositModule, MyriaClient } from "myria-core-sdk";
import { convertEthToWei } from "../common/convertEthToWei";

export async function depositErc20(client: MyriaClient, starkKey: string, publicKey: string, contractAddress: string, amount: string) {
  const depositModule: DepositModule = new DepositModule(client);

  const params: DepositERC20Params = {
    starkKey: starkKey,
    contractAddress: contractAddress,
    amount: convertEthToWei(amount),
    ethAddress: publicKey
  }

  console.log(params);

  const depositResponse = await depositModule.depositERC20(params);

  if (depositResponse) {
    console.log("Deposit response:");
    console.log(JSON.stringify(depositResponse, null, 2));
  }
}
