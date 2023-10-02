import { ModuleFactory, MyriaClient } from "myria-core-sdk";
import { toast } from "react-toastify";

export async function unListErc721(
  client: MyriaClient,
  account: string,
  assets: any
) {
  const moduleFactory = new ModuleFactory(client);
  const orderModule = moduleFactory.getOrderManager();
  if (!account || !assets?.order?.[0].id) return;
  try {
    const result = await orderModule?.deleteOrderById({
      orderId: assets?.order?.[0].id,
      sellerWalletAddress: account,
    });
    toast.success("Delisting asset(s) successfully!");
  } catch (error) {
    toast.error("Delisting asset(s) failed!. Please check exception and try again !");
  }
}
