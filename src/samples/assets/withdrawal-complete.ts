import { DeveloperAccountManager, MyriaClient, TokenType, WithdrawalModule, WithdrawAndMintParams } from "myria-core-sdk";

export async function completeErc721Withdrawal(client: MyriaClient, nft: any, account: string) {
  const withdrawalModule: WithdrawalModule = new WithdrawalModule(client);
  const devAccountManager: DeveloperAccountManager = new DeveloperAccountManager(client);
  const starkKey = (await devAccountManager.getUserByWalletAddress(account)).starkKey;

  const params: WithdrawAndMintParams = {
    starkKey: starkKey,
    walletAddress: account,
    tokenType: TokenType.MINTABLE_ERC721,
    assetType: nft.assetType,
    tokenAddress: nft.tokenAddress,
    mintingBlob: nft.blueprint
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
