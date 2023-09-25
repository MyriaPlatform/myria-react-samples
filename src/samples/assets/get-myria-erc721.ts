import { MyriaClient, OnchainAssetManager } from "myria-core-sdk";

export async function getMyriaErc721ByStarkKey(client: MyriaClient, starkKey: string, page?:number, limit?: number) {
  const assetManager: OnchainAssetManager = new OnchainAssetManager(client);

  let assets: any = [];
  try {
    console.log(
      `Retrieving a list of assets with ${starkKey} stark key...`
    );
    const assetData = await assetManager.getAssetByStarkKey(starkKey, page, limit);
    if(assetData.data) {
      assets = assetData.data.items
    } else {
      assets = []
    }
    return assets;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    return;
  }
}
