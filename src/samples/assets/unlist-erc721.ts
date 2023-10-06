import { ModuleFactory, MyriaClient } from "myria-core-sdk";
import { toast } from "react-toastify";

export async function unListErc721(
  client: MyriaClient,
  account: string,
  assets: any
) {
  const moduleFactory = new ModuleFactory(client);
  const orderModule = moduleFactory.getOrderManager();
  const orderId = assets?.order?.[0]?.id || assets?.order?.id;
  if (!account || !orderId) return;
  try {
    const result = await orderModule?.deleteOrderById({
      orderId: orderId,
      sellerWalletAddress: account,
    });
    toast.success("Delisting asset(s) successfully!");
  } catch (error) {
    toast.error("Delisting asset(s) failed!. Please check exception and try again !");
  }
}
