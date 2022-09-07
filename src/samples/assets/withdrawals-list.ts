import {
  DeveloperAccountManager,
  MyriaClient,
  TransactionManager
} from "myria-core-sdk";

export async function getWithdrawalsList(client: MyriaClient, account: string) {
  const devAccountManager: DeveloperAccountManager = new DeveloperAccountManager(client);
  const starkKey = (await devAccountManager.getUserByWalletAddress(account)).starkKey;
  const trxManager: TransactionManager = new TransactionManager(client);

  let withdrawals;
  try {
    console.log(
      `Retrieving a list of withdrawals...`
    );
    await trxManager.getTransactionList(starkKey)
      .then((data) => {
        if (data.data) {
          withdrawals = data.data
            .filter((item: any) => item.transactionType == "WithdrawalRequest")
        }
      })
    console.log(withdrawals);
    return withdrawals;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    return;
  }
}