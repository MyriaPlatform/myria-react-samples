import { MyriaClient } from 'myria-core-sdk';
import { useEffect } from 'react';
import { useState } from "react";
import { completeErc721Withdrawal } from '../samples/nfts/complete-nft-withdrawal';
import { getWithdrawalsList } from '../samples/nfts/get-withdrawals-list';

type Props = {
	isConnected: boolean,
	account: string,
	starkKey: string
	client: MyriaClient
}

const NftWithdrawals = ({ isConnected, account, starkKey, client }: Props) => {
	const [withdrawals, setWithdrawals] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [err, setErr] = useState('');

	const completeWithdrawal = async (asset: any) => {
		const result = await completeErc721Withdrawal(client, account, asset, starkKey);
		console.log(result);
	}

	useEffect(() => {
		if (isConnected) {
			const getWithdrawals = async () => {
				setIsLoading(true);
				try {
					const result = await getWithdrawalsList(client, starkKey);
					setWithdrawals(result);
				} catch (err: any) {
					setErr(err.message);
				} finally {
					setIsLoading(false);
					setIsLoaded(true);
				}
			}
			getWithdrawals();
		}
	}, []);

	return (
		<div>
			{err && <code className="mt-3">{err}</code>}

			{!isConnected && <p>Please connect your wallet first!</p>}

			{isLoading && <p>Loading...</p>}

			<div className="row align-items-start text-center mt-3">
				{(Array.isArray(withdrawals) && isLoaded)
					? withdrawals.map((item: any) => (
						<div className="col mb-3" key={item.assetId}>
							<div className="card" style={{ width: "14rem" }}>
								<div className="card-body">
									<h5 className="card-title">#{item.tokenId}</h5>
									<p className="card-text">Status: {item.transactionStatus}</p>
									{
										(item.transactionStatus === "Pending") ? "" :
											<a className="card-link" onClick={() => completeWithdrawal(item)}>Complete Withdrawal</a>
									}
								</div>
								<div className="card-footer">
									<small className="text-muted">{item.tokenType}</small>
								</div>
							</div>
						</div>
					))
					: (isLoaded && !(Array.isArray(withdrawals)) && <p>No withdrawals available</p>)
				}
			</div>
		</div>
	);
}

export default NftWithdrawals;