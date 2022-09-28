import { MyriaClient, OnchainAssetManager } from "myria-core-sdk";

export async function getMyriaErc721ByStarkKey(client: MyriaClient, starkKey: string) {
  const assetManager: OnchainAssetManager = new OnchainAssetManager(client);

  let assets: any = [];
  try {
    console.log(
      `Retrieving a list of assets with ${starkKey} stark key...`
    );
    await assetManager.getFullInfoAssetByStarkKey(starkKey)
      .then((data: any) => {
        data.data.MINTABLE_ERC721.forEach((item: any) => {
          item.forEach((asset: any) => {
            assets.push(asset);
          });
        });
      });
    console.log(assets);
    return assets;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    return;
  }
}