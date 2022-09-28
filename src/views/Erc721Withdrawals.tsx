import { MyriaClient } from 'myria-core-sdk';
import { useEffect } from 'react';
import { useState } from "react";
import TextCard from '../components/TextCard';
import { completeErc721Withdrawal } from '../samples/assets/complete-erc721-withdrawal';
import { getWithdrawalsList } from '../samples/assets/get-withdrawals-list';

type Props = {
	isConnected: boolean,
	account: string,
	starkKey: string
	client: MyriaClient
}

const Erc721Withdrawals = ({ isConnected, account, starkKey, client }: Props) => {
	const [withdrawals, setWithdrawals] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [err, setErr] = useState('');

	const onCompleteWithdrawal = async (asset: any) => {
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
							<TextCard
								item={item}
								onButtonClick1={() => onCompleteWithdrawal(item)}
								buttonTitle1="Complete Withdrawal"
								title={`#${item.tokenId}`}
								body={`Status: ${item.transactionStatus}`}
								footer={`#${item.id} | ${item.publicId}`}
							/>
						</div>
					))
					: (isLoaded && !(Array.isArray(withdrawals)) && <p>No withdrawals available</p>)
				}
			</div>
		</div>
	);
}

export default Erc721Withdrawals;