import { MyriaClient, WithdrawalModule, WithdrawNftOffChainParams } from "myria-core-sdk";

export async function withdrawErc721(client: MyriaClient, nft: any, account: string) {
	const withdrawalModule: WithdrawalModule = new WithdrawalModule(client);

	const params: WithdrawNftOffChainParams = {
		id: nft.id,
		tokenId: nft.tokenId,
		tokenAddress: nft.tokenAddress,
		senderVaultId: nft.vaultId,
		senderPublicKey: account,
		receiverPublicKey: "0x75e0D99fa416823F4C07CDafC86A3B0cA37B52A5",
		assetId: nft.assetId,
		quantizedAmount: nft.amount
	}

	console.log(params);

	let withdrawalResponse;
	try {
		console.log("Withdrawing the ERC721...");
		withdrawalResponse = await withdrawalModule.withdrawNftOffChain(params);
		console.log("Withdrawal response:");
		console.log(JSON.stringify(withdrawalResponse, null, 2));
		return withdrawalResponse;
	} catch (error) {
		if (error instanceof Error) {
			console.log(JSON.stringify(error.message, Object.getOwnPropertyNames(error.message)));
		}
		return;
	}
}
