import { ModuleFactory, MyriaClient } from "myria-core-sdk";

export async function bulkUnListErc721(
  client: MyriaClient,
  account: string,
  assets: any
) {
  const moduleFactory = new ModuleFactory(client);
  const orderModule = moduleFactory.getOrderManager();
  try {
    for (let i = 0; i < assets.length; i++) {
      if (!account || !assets[i]?.order?.[0].id) return;
      const result = await orderModule?.deleteOrderById({
        orderId: assets[i]?.order?.[0].id,
        sellerWalletAddress: account,
      });
      console.log(`UnListed asset #${i}`)
    }
  } catch (error) {
    throw error;
  }
}
