import {
  CreateOrderV2Params,
  EnvTypes,
  FeeDto,
  ModuleFactory,
  MyriaClient,
  OrderType,
  TokenType,
} from "myria-core-sdk";
import { MYRIA_TOKEN_PROD, MYRIA_TOKEN_STAGING } from "../../utils/utils";
import { toast } from "react-toastify";

export async function listErc721(
  client: MyriaClient,
  account: string,
  starkKey: string,
  assetId: string,
  price: string,
  currentTokenType: TokenType
) {
  const moduleFactory = new ModuleFactory(client);
  const orderManager = moduleFactory.getOrderManager();
  const assetManager = moduleFactory.getAssetOnchainManager();
  const asset = ((await assetManager.getAssetById(assetId)) as any).data;

  const feeData: FeeDto[] = [
    {
      feeType: asset?.fee?.[0].feeType,
      percentage: asset?.fee?.[0]?.percentage,
      address: account,
    },
  ];

  const paramCreateOrder: CreateOrderV2Params = {
    orderType: OrderType.SELL,
    ownerWalletAddress: account,
    ownerStarkKey: starkKey,
    assetRefId: parseInt(asset.id, 10),
    tokenSell: {
      tokenType: TokenType.MINTABLE_ERC721,
      data: {
        tokenId: asset?.tokenId,
        tokenAddress: asset?.tokenAddress,
      },
    },
    tokenReceived: {
      tokenType: currentTokenType,
      data: {
        tokenAddress:
          currentTokenType === TokenType.ERC20
            ? client.env === EnvTypes.PRODUCTION
              ? MYRIA_TOKEN_PROD.tokenAddress
              : MYRIA_TOKEN_STAGING.tokenAddress
            : undefined,
      },
    },
    price: price + "",
    fees: feeData,
  };
  const listResponse = await orderManager?.createOrderV2(paramCreateOrder);
  toast.success('Listing success!')
}
