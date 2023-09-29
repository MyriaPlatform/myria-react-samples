import {
  CreateOrderV2Params,
  EnvTypes,
  FeeDto,
  ModuleFactory,
  MyriaClient,
  OrderEntity,
  OrderType,
  TokenType,
} from "myria-core-sdk";
import { MYRIA_TOKEN_PROD, MYRIA_TOKEN_STAGING } from "../../utils/utils";

const timer = (ms: any) => new Promise((res) => setTimeout(res, ms));

async function getAssets(assets: any, assetManager: any) {
  const data: any[] = [];
  for (let i = 0; i < assets.length; i++) {
    const assetDetails = (
      (await assetManager.getAssetById(assets[i].id)) as any
    ).data;
    data.push(assetDetails);
  }
  return data;
}

export async function bulkListErc721(
  client: MyriaClient,
  account: string,
  starkKey: string,
  assets: any,
  price: string,
  currentAssetType: TokenType
) {
  const moduleFactory = new ModuleFactory(client);
  const orderManager = moduleFactory.getOrderManager();
  const assetManager = moduleFactory.getAssetOnchainManager();

  const data = await getAssets(assets, assetManager);
  let bulkListResult: OrderEntity[] = [];

  console.log("Initiating a bulk listing...", data);

  for (let i = 0; i < assets.length; i++) {
    const feeData: FeeDto[] = [
      {
        feeType: data[i]?.fee?.[0].feeType ?? '',
        percentage: data[i]?.fee?.[0]?.percentage,
        address: account,
      },
    ];

    const paramCreateOrder: CreateOrderV2Params = {
      orderType: OrderType.SELL,
      ownerWalletAddress: account,
      ownerStarkKey: starkKey,
      assetRefId: parseInt(data[i].id, 10),
      tokenSell: {
        tokenType: TokenType.MINTABLE_ERC721,
        data: {
          tokenId: data[i]?.tokenId,
          tokenAddress: data[i]?.tokenAddress,
        },
      },
      tokenReceived: {
        tokenType: currentAssetType,
        data: {
          tokenAddress:
            currentAssetType === TokenType.ERC20
              ? client.env === EnvTypes.PRODUCTION
                ? MYRIA_TOKEN_PROD.tokenAddress
                : MYRIA_TOKEN_STAGING.tokenAddress
              : undefined,
        },
      },
      price: price + "",
      fees: feeData,
    };

    const listingResponse = await orderManager?.createOrderV2(paramCreateOrder);
    if (listingResponse) {
      console.log(`Listed asset #${data[i].id}`);
      bulkListResult.push(listingResponse);
    }
    await timer(3000);
  }
  if (bulkListResult && bulkListResult.length) {
    console.log(
      `Bulk listing is completed. Listed ${bulkListResult.length} assets...`
    );
  }
}
