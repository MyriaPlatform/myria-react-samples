import {
  MyriaClient,
  OnchainAssetManager
} from "myria-core-sdk";
import config from "../config";

export async function getAssetsByStarkKey(client: MyriaClient) {
  const starkKey = config.stark_key;
  const assetManager: OnchainAssetManager = new OnchainAssetManager(client);

  let nfts;
  try {
    console.log(
      `Retrieving a list of assets with ${starkKey} stark key...`
    );
    await assetManager.getFullInfoAssetByStarkKey(starkKey)
      .then((data) => {
        nfts = (data as any).data.MINTABLE_ERC721[0];
      });
    console.log(nfts);
    return nfts;
  } catch (error) {
    if (error instanceof Error) {
      console.log(JSON.stringify(error.message, Object.getOwnPropertyNames(error.message)));
    }
    return;
  }
}