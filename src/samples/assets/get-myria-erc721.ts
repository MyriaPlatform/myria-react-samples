import { MyriaClient, OnchainAssetManager } from "myria-core-sdk";

export async function getMyriaErc721ByStarkKey(client: MyriaClient, starkKey: string) {
  const assetManager: OnchainAssetManager = new OnchainAssetManager(client);

  let assets;
  try {
    console.log(
      `Retrieving a list of assets with ${starkKey} stark key...`
    );
    await assetManager.getFullInfoAssetByStarkKey(starkKey)
      .then((data) => {
        assets = (data as any).data.MINTABLE_ERC721[0];
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