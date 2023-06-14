import { MyriaClient, WithdrawalModule, WithdrawAndMintParams } from "myria-core-sdk";

export async function completeErc721Withdrawal(client: MyriaClient, account: string, asset: any, starkKey: string) {
  const withdrawalModule: WithdrawalModule = new WithdrawalModule(client);

  const params: WithdrawAndMintParams = {
    starkKey: starkKey,
    walletAddress: account,
    assetType: asset.assetType,
    mintingBlob: `{${asset.tokenId}}:{${asset.blueprint}}`
  }
  console.log(params);

  let result;
  try {
    console.log("Completing a withdrawal...");
    result = await withdrawalModule.withdrawAndMint(params);
    if (result) {
      console.log("Withdrawal result:");
      console.log(JSON.stringify(result, null, 2));
    }
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return;
  }
}
