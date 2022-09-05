import { MyriaClient, WithdrawalModule, WithdrawNftOffChainParams } from "myria-core-sdk";
import config from "../config";

export async function withdrawErc721(client: MyriaClient, nft: any, account: string) {
	const withdrawalModule: WithdrawalModule = new WithdrawalModule(client);
	const starkKey = config.stark_key;

	const params: WithdrawNftOffChainParams = {
		id: nft.id,
		tokenId: nft.tokenId,
		tokenAddress: nft.tokenAddress,
		senderVaultId: nft.vaultId,
		senderPublicKey: starkKey,
		receiverPublicKey: account,
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

		const balance = await withdrawalModule.getWithdrawalBalance(account, nft.assetId);
		console.log(balance);

		return withdrawalResponse;
	} catch (error) {
		if (error instanceof Error) {
			console.log(JSON.stringify(error.message, Object.getOwnPropertyNames(error.message)));
		}
		return;
	}
}
