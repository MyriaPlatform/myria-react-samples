import { MyriaClient, WithdrawalModule, WithdrawNftOffChainParams } from "myria-core-sdk";
import config from "../config";

export async function withdrawErc721(client: MyriaClient) {
	const ownerKey: string = config.owner_public_key;
	const withdrawalModule: WithdrawalModule = new WithdrawalModule(client);

	const params: WithdrawNftOffChainParams = {
		id: 31161,
		tokenId: "2",
		tokenAddress: "0x3bb911f179f34aac30ef4e175f57dedf49312cb7",
		senderVaultId: 70829,
		senderPublicKey: ownerKey,
		receiverPublicKey: "0x75e0D99fa416823F4C07CDafC86A3B0cA37B52A5",
		assetId: "0x400dded535e95b48da4e141d84ce2e1fd1b5038df49432aa9af3d265f793a13",
		quantizedAmount: "1"
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
