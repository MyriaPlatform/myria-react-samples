import {
	MyriaClient,
	OnchainAssetManager
} from "myria-core-sdk";

export async function getAssetsByOwnerPublicKey(client: MyriaClient, account: string) {
	const assetManager: OnchainAssetManager = new OnchainAssetManager(client);

	let nfts;
	try {
		console.log(
			`Retrieving a list of assets with ${account} public key...`
		);
		nfts = await assetManager.getAssetsByOwnerPublicKey(account);
		console.log(nfts);
		return nfts.data;
	} catch (error) {
		if (error instanceof Error) {
			console.log(JSON.stringify(error.message, Object.getOwnPropertyNames(error.message)));
		}
		return;
	}
}