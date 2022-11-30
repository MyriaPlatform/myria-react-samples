import Web3 from 'web3';

export function convertEthToWei(amount: string): string {
  if (!amount || Number(amount) === 0) return '0';

  return Web3.utils.toWei(amount.toString()).toString();
}