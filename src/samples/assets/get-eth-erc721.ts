import { Alchemy, Network } from "alchemy-sdk";

export async function getEthErc721(account: string) {
  // this is a test api key, replace it with yours
  const config = {
    apiKey: "kmzrSbbtp1TmmGpJ3WvlQbOKjihk4rLF",
    network: Network.ETH_GOERLI,
  };
  const alchemy = new Alchemy(config);

  let assets;
  try {
    console.log(
      `Retrieving a list of assets...`
    );
    assets = (await alchemy.nft.getNftsForOwner(account)).ownedNfts;
    console.log(assets);
    return assets;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    return;
  }
}