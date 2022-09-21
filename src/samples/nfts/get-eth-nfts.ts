import { Alchemy, Network } from "alchemy-sdk";

export async function getEthNfts(account: string) {
  const config = {
    apiKey: "ALCHEMY_KEY",
    network: Network.ETH_GOERLI,
  };
  const alchemy = new Alchemy(config);

  let nfts;
  try {
    console.log(
      `Retrieving a list of assets...`
    );
    nfts = (await alchemy.nft.getNftsForOwner(account)).ownedNfts;
    console.log(nfts);
    return nfts;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    return;
  }
}