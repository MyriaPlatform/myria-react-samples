import { useEffect } from 'react';
import { useState } from "react";
import { getWithdrawalsList } from '../samples/assets/withdrawals-list';
import { getMyriaClient } from '../samples/common/myria-client';

type Props = {
	isConnected: boolean,
	account: string
}

const Withdrawals = ({ isConnected, account }: Props) => {
	const [withdrawals, setWithdrawals] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [err, setErr] = useState('');

	useEffect(() => {
		const getWithdrawals = async () => {
			setIsLoading(true);
			try {
				const client = await getMyriaClient(isConnected);
				const result = await getWithdrawalsList(client, account);
				setWithdrawals(result);
			} catch (err: any) {
				setErr(err.message);
			} finally {
				setIsLoading(false);
				setIsLoaded(true);
			}
		}

		getWithdrawals();
	}, []);

	return (
		<div>
			{err && <code className="mt-3">{err}</code>}

			{isLoading && <p>Loading...</p>}

			<div className="row align-items-start text-center mt-3">
				{(Array.isArray(withdrawals) && isLoaded)
					? withdrawals.map((item: any) => (
						<div className="col mb-3" key={item.assetId}>
							<div className="card" style={{ width: "14rem" }}>
								<div className="card-body">
									<h5 className="card-title">#{item.tokenId}</h5>
									<p className="card-text">Status: {item.transactionStatus}</p>
									<a className="card-link"> {item.transactionStatus === "Pending" ? "" : "Finish Withdrawal"}</a>
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

export default Withdrawals;