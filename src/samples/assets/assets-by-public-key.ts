import {
	EnvTypes,
	IMyriaClient,
	ModuleFactory,
	MyriaClient
} from "myria-core-sdk";

export async function getAssetsByOwnerPublicKey(client: MyriaClient, account: string) {
	const iClient: IMyriaClient = {
    provider: null,
    networkId: null,
    web3: null,
    env: EnvTypes.STAGING
  };
  const mClient = new MyriaClient(iClient);
  const moduleFactory = new ModuleFactory(mClient);
  const assetManager = moduleFactory.getAssetOnchainManager();

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