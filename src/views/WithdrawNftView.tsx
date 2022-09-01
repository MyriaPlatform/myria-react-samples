import { useState } from "react";
import { getMyriaClient } from "../samples/common/myria-client";
import { withdrawErc721 } from "../samples/assets/withdraw-erc721";
import '../assets/styles.css';

type Props = {
	isConnected: boolean
}

function WithdrawNftView({ isConnected }: Props) {
	const [withdrawalResult, setWithdrawalResult] = useState(null);
	const [isWithdrawing, setIsWithdrawing] = useState(false);
	const [err, setErr] = useState('');

	const withdrawAsset = async () => {
		setIsWithdrawing(true);
		try {
			const client = await getMyriaClient(isConnected);
			const result = await withdrawErc721(client);
			setWithdrawalResult(result);
		} catch (err: any) {
			setErr(err.message);
		} finally {
			setIsWithdrawing(false);
		}
	}

	return (
		<div>
			<button onClick={withdrawAsset}>Withdraw Asset</button>

			{err && <h2>{err}</h2>}

			{isWithdrawing && <h2>Withdrawing...</h2>}

			{withdrawalResult}

		</div>
	);
}

export default WithdrawNftView;
