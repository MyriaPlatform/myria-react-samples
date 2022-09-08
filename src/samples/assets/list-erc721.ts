import { CreateOrderEntity, ModuleFactory, MyriaClient, SignableOrderInput, TokenType } from "myria-core-sdk";

export async function listErc721(client: MyriaClient, account: string, asset: any) {
  const moduleFactory = new ModuleFactory(client);
  const orderManager = moduleFactory.getOrderManager();
  const devAccountManager = moduleFactory.getDeveloperAccountManager();
  const starkKey = (await devAccountManager.getUserByWalletAddress(account)).starkKey;

  if (!account) return;
  const payload: SignableOrderInput = {
    orderType: 'SELL',
    ethAddress: account,
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
    amountBuy: "0.001",
    includeFees: false
  };
  
  const signature = await orderManager?.signableOrder(payload);
  if (signature) {
    const paramCreateOrder: CreateOrderEntity = {
      assetRefId: parseInt(asset.id, 10),
      orderType: 'SELL',
      fees: [{}],
      includeFees: false,
      amountSell: signature.amountSell,
      amountBuy: signature.amountBuy,
      sellerStarkKey: starkKey,
      vaultIdSell: signature.vaultIdSell,
      vaultIdBuy: signature.vaultIdBuy,
      sellerAddress: account,
      assetIdBuy: signature.assetIdBuy,
      assetIdSell: signature.assetIdSell
    };
    console.log(paramCreateOrder);

    const res = await orderManager?.createOrder(paramCreateOrder);
    console.log(res);
  }
}
