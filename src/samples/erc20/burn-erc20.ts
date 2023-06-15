import { v4 as uuidV4 } from "uuid";
import {
  TransactionManager,
  MyriaClient,
  TokenType,
  BurnTokenParams,
  ItemSignableBurnParams,
} from "myria-core-sdk";
import { QUANTUM, convertAmountToQuantizedAmount } from "./transfer-erc20";

const partnerRefId = "Project1";
const erc20BurnDescription = "Test-Test Burn Transfer";

export async function burnERC20(
  client: MyriaClient,
  walletAddress: string,
  inputContractAddress: string,
  amount: string
) {
  const transactionModule: TransactionManager = new TransactionManager(client);

  const burnTransferredItems: ItemSignableBurnParams[] = [
    {
      quantizedAmount: String(convertAmountToQuantizedAmount(amount)),
      tokenType: TokenType.ERC20,
      tokenData: {
        tokenAddress: inputContractAddress,
        quantum: QUANTUM,
      },
    },
  ];
  const randomRequestID = uuidV4();
  const params: BurnTokenParams = {
    senderWalletAddress: walletAddress,
    groupRequestId: randomRequestID,
    requestId: randomRequestID,
    partnerRefId: partnerRefId,
    description: erc20BurnDescription,
    items: burnTransferredItems,
  };
  try {
      await transactionModule.burnTokens(params);
  } catch (error) {
    console.log(error)
  }
}
