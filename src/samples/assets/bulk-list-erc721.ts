import { CreateOrderEntity, FeeType, ModuleFactory, MyriaClient, OrderEntity, SignableOrderInput, TokenType } from "myria-core-sdk";

async function getAssets(assets: any, assetManager: any) {
  const listingAssets: any[] = [];
  assets.forEach(async (asset: any) => {
    const assetDetails = (await assetManager.getAssetById(asset.id) as any).data;
    listingAssets.push(assetDetails);
  });
  return listingAssets;
}

export async function bulkListErc721(
  client: MyriaClient,
  account: string,
  starkKey: string,
  assets: any,
  price: string,
  startIndex: number,
  endIndex: number
) {
  const moduleFactory = new ModuleFactory(client);
  const orderManager = moduleFactory.getOrderManager();
  const assetManager = moduleFactory.getAssetOnchainManager();
  const listingAssets = await getAssets(assets, assetManager);

  const timer = (ms: any) => new Promise(res => setTimeout(res, ms));
  let bulkListResult: OrderEntity[] = [];

  try {
    console.log("Initiating a bulk listing...");
    await timer(2000);

    // price = "0.5";
    // startIndex = 0;
    // endIndex = 2;

    for (let i = startIndex; i < endIndex; i++) {
      console.log(startIndex, endIndex, price);
      const signableFee =
        (listingAssets[i]?.fee && listingAssets[i]?.fee?.length) > 0
          ? [
            {
              address: listingAssets[i]?.fee[0].address,
              percentage: listingAssets[i]?.fee[0].percentage,
              feeType: FeeType.ROYALTY
            }
          ]
          : undefined;

      const payload: SignableOrderInput = {
        orderType: "SELL",
        ethAddress: account,
        assetRefId: parseInt(listingAssets[i].id, 10),
        starkKey: starkKey,
        tokenSell: {
          type: TokenType.MINTABLE_ERC721,
          data: {
            tokenId: listingAssets[i]?.tokenId,
            tokenAddress: listingAssets[i]?.tokenAddress
          }
        },
        amountSell: "1",
        tokenBuy: {
          type: TokenType.ETH,
          data: {
            quantum: "10000000000"
          }
        },
        amountBuy: price + '',
        includeFees: signableFee ? true : false,
        fees: signableFee
      };

      const signature = await orderManager?.signableOrder(payload);
      await timer(2000);

      const feeSign = signature?.feeInfo
        ? {
          feeLimit: signature?.feeInfo?.feeLimit,
          feeToken: signature?.feeInfo?.assetId,
          feeVaultId: signature?.feeInfo?.sourceVaultId
        }
        : undefined;

      const feeData = signature?.feeInfo
        ? [
          {
            feeType: FeeType.ROYALTY,
            percentage: listingAssets[i]?.fee[0].percentage,
            address: account
          }
        ]
        : undefined;

      if (signature) {
        const paramCreateOrder: CreateOrderEntity = {
          assetRefId: parseInt(listingAssets[i].id, 10),
          orderType: "SELL",
          feeSign: feeSign,
          includeFees: true,
          amountSell: signature.amountSell,
          amountBuy: signature.amountBuy,
          sellerStarkKey: starkKey,
          vaultIdSell: signature.vaultIdSell,
          vaultIdBuy: signature.vaultIdBuy,
          sellerAddress: account,
          assetIdBuy: signature.assetIdBuy,
          assetIdSell: signature.assetIdSell,
          fees: feeData
        };
        const listResponse = await orderManager?.createOrder(paramCreateOrder);
        if (listResponse) {
          console.log(`Listed asset #${listingAssets[i].id}`);
          bulkListResult.push(listResponse);
        }
      }
      await timer(2000);
    }
    if (bulkListResult && bulkListResult.length) {
      console.log(`Bulk listing is completed. Listed ${bulkListResult.length} assets...`);
    }
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }
}