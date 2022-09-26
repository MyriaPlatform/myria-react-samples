import { CreateOrderEntity, FeeType, ModuleFactory, MyriaClient, SignableOrderInput, TokenType } from "myria-core-sdk";

export async function listErc721(client: MyriaClient, account: string, starkKey: string, assetId: string) {
  const moduleFactory = new ModuleFactory(client);
  const orderManager = moduleFactory.getOrderManager();
  const assetManager = moduleFactory.getAssetOnchainManager();
  const asset = (await assetManager.getAssetById(assetId)).data;
  const price = "0.01";

  const signableFee =
    (asset.fee && asset?.fee?.length) > 0
      ? [
        {
          address: asset?.fee[0].address,
          percentage: asset?.fee[0].percentage,
          feeType: FeeType.ROYALTY
        }
      ]
      : undefined;

  const payload: SignableOrderInput = {
    orderType: "SELL",
    ethAddress: account,
    assetRefId: parseInt(assetId, 10),
    starkKey: starkKey,
    tokenSell: {
      type: TokenType.MINTABLE_ERC721,
      data: {
        tokenId: asset?.tokenId,
        tokenAddress: asset?.tokenAddress
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
        percentage: asset?.fee[0].percentage,
        address: account
      }
    ]
    : undefined;

  if (signature) {
    const paramCreateOrder: CreateOrderEntity = {
      assetRefId: parseInt(assetId, 10),
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
    return await orderManager?.createOrder(paramCreateOrder);
  }
}