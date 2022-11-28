import { CreateOrderEntity, FeeType, ModuleFactory, MyriaClient, OrderEntity, SignableOrderInput, TokenType } from "myria-core-sdk";

const timer = (ms: any) => new Promise(res => setTimeout(res, ms));

async function getAssets(assets: any, assetManager: any) {
  const data: any[] = [];
  assets.forEach(async (asset: any) => {
    const assetDetails = (await assetManager.getAssetById(asset.id) as any).data;
    data.push(assetDetails);
  });
  await timer(3000);
  return data;
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

  await getAssets(assets, assetManager).then(async (data) => {
    let bulkListResult: OrderEntity[] = [];

    console.log("Initiating a bulk listing...");
    await timer(2000);

    for (let i = startIndex; i < endIndex; i++) {
      const signableFee =
        (data[i]?.fee && data[i]?.fee?.length) > 0
          ? [
            {
              address: data[i]?.fee[0].address,
              percentage: data[i]?.fee[0].percentage,
              feeType: FeeType.ROYALTY
            }
          ]
          : undefined;

      const payload: SignableOrderInput = {
        orderType: "SELL",
        ethAddress: account,
        assetRefId: data[i].id,
        starkKey: starkKey,
        tokenSell: {
          type: TokenType.MINTABLE_ERC721,
          data: {
            tokenId: data[i]?.tokenId,
            tokenAddress: data[i]?.tokenAddress
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
      await timer(4000);

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
            percentage: data[i]?.fee[0].percentage,
            address: account
          }
        ]
        : undefined;

      if (signature) {
        const paramCreateOrder: CreateOrderEntity = {
          assetRefId: parseInt(data[i].id, 10),
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
          console.log(`Listed asset #${data[i].id}`);
          bulkListResult.push(listResponse);
        }
      }
      await timer(3000);
    }
    if (bulkListResult && bulkListResult.length) {
      console.log(`Bulk listing is completed. Listed ${bulkListResult.length} assets...`);
    }
  });
}