import {
  MyriaClient,
  WithdrawalModule,
  WithdrawNftOffChainParams,
} from "myria-core-sdk";
import { toast } from "react-toastify";

export async function withdrawErc721(
  client: MyriaClient,
  asset: any,
  account: string,
  starkKey: string
) {
  const withdrawalModule: WithdrawalModule = new WithdrawalModule(client);
  const params: WithdrawNftOffChainParams = {
    id: asset.id,
    tokenId: asset.tokenId,
    tokenAddress: asset.tokenAddress,
    senderVaultId: asset.vaultId,
    senderPublicKey: starkKey,
    receiverPublicKey: account,
    assetId: asset.assetMintId,
    quantizedAmount: '1',
  };


  let withdrawalResponse;
  try {
    console.log("Withdrawing the ERC721...");
    withdrawalResponse = await withdrawalModule.withdrawNftOffChain(params);
    if (withdrawalResponse) {
      console.log("Withdrawal response:");
      console.log(JSON.stringify(withdrawalResponse, null, 2));
      toast.success("Withdraw success!");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}
