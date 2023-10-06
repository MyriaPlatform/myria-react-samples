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
      const orderId = assets[i]?.order?.[0]?.id || assets[i]?.order?.id;
      if (!account || !orderId) return;
      const result = await orderModule?.deleteOrderById({
        orderId: orderId,
        sellerWalletAddress: account,
      });
      console.log(`UnListed asset #${i}`)
    }
  } catch (error) {
    throw error;
  }
}
