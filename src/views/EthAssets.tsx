import { MyriaClient } from 'myria-core-sdk';
import { useEffect, useState } from 'react';
import TextCard from '../components/TextCard';
import { depositErc721 } from '../samples/assets/deposit-erc721';
import { getEthErc721 } from "../samples/assets/get-eth-erc721";

type Props = {
	isConnected: boolean,
	account: string,
	starkKey: string,
	client: MyriaClient
}

const EthAssets = ({ isConnected, account, client, starkKey }: Props) => {
	const [assets, setAssets] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [err, setErr] = useState('');

	useEffect(() => {
		if (isConnected) {
			const getAssets = async () => {
				setIsLoading(true);
				try {
					const result = await getEthErc721(account);
					setAssets(result);
				} catch (err: any) {
					setErr(err.message);
				} finally {
					setIsLoading(false);
					setIsLoaded(true);
				}
			}
			getAssets();
		}
	}, []);

	const onDeposit = async (asset: any) => {
		const depositResult = await depositErc721(client, starkKey, asset.contract.address, asset.tokenId);
		console.log(depositResult);
	}

	return (
		<div>
			{err && <code className="mt-3">{err}</code>}

			{!isConnected && <p>Please connect your wallet first!</p>}

			{isLoading && <p>Loading assets...</p>}

			<div className="row align-items-start text-center mt-3">
				{(Array.isArray(assets) && isLoaded)
					? assets.map((asset: any) => (
						<div className="col mb-3" key={asset.tokenId}>
							<TextCard
								item={asset}
								onButtonClick1={() => onDeposit(asset)}
								buttonTitle1="Deposit to Myria"
								title={`#${asset.tokenId}`}
								body={asset.contract.address}
								footer={asset.tokenType}
							/>
						</div>
					))
					: (isLoaded && (!assets.length) && <p>No assets available</p>)
				}
			</div>
		</div>
	);
}

export default EthAssets;