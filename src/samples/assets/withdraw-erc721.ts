import { MyriaClient, WithdrawalModule, WithdrawNftOffChainParams } from "myria-core-sdk";

export async function withdrawErc721(client: MyriaClient, asset: any, account: string, starkKey: string) {
	const withdrawalModule: WithdrawalModule = new WithdrawalModule(client);

	const params: WithdrawNftOffChainParams = {
		id: asset.id,
		tokenId: asset.tokenId,
		tokenAddress: asset.tokenAddress,
		senderVaultId: asset.vaultId,
		senderPublicKey: starkKey,
		receiverPublicKey: account,
		assetId: asset.assetId,
		quantizedAmount: asset.amount
	}

	console.log(params);

	let withdrawalResponse;
	try {
		console.log("Withdrawing the ERC721...");
		withdrawalResponse = await withdrawalModule.withdrawNftOffChain(params);
		if(withdrawalResponse) {
			console.log("Withdrawal response:");
			console.log(JSON.stringify(withdrawalResponse, null, 2));
		}

		return withdrawalResponse;
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message);
		}
		return;
	}
}
