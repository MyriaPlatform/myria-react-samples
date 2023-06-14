import {
  WithdrawOffchainParamsV2,
  WithdrawalModule,
  MyriaClient,
  TokenType,
} from "myria-core-sdk";

export async function withdrawERC20(
  client: MyriaClient,
  starkKey: string,
  walletAddress: string,
  tokenAddress: string,
  amount: string
) {
  const withdrawERC20Module: WithdrawalModule = new WithdrawalModule(client);

  const params: WithdrawOffchainParamsV2 = {
    senderPublicKey: starkKey,
    senderEthAddress: walletAddress,
    receiverPublicKey: walletAddress,
    quantum: "10000000000",
    amount: amount,
    tokenAddress: tokenAddress,
    tokenType: TokenType.ERC20,
  };

  await withdrawERC20Module.withdrawalOffchainV2(params);
}
