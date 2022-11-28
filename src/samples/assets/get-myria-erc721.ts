import { MyriaClient, OnchainAssetManager } from "myria-core-sdk";

export async function getMyriaErc721ByStarkKey(client: MyriaClient, starkKey: string) {
  const assetManager: OnchainAssetManager = new OnchainAssetManager(client);

  let assets: any = [];
  try {
    console.log(
      `Retrieving a list of assets with ${starkKey} stark key...`
    );
    await assetManager.getAssetByStarkKey(starkKey).then((data: any) => {
      assets = data.data.items
    });
    return assets;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    return;
  }
}