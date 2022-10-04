import { MyriaClient } from 'myria-core-sdk';
import { useEffect, useState } from 'react';
import ImageCard from '../components/ImageCard';
import { getMyriaErc721ByStarkKey } from "../samples/assets/get-myria-erc721";
import { listErc721 } from '../samples/assets/list-erc721';
import { bulkListErc721 } from '../samples/assets/bulk-list-erc721';
import { withdrawErc721 } from "../samples/assets/withdraw-erc721";

type Props = {
	isConnected: boolean,
	account: string,
	starkKey: string,
	client: MyriaClient
}

const MyriaAssets = ({ isConnected, account, starkKey, client }: Props) => {
	const [assets, setAssets] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [err, setErr] = useState('');

	useEffect(() => {
		if (isConnected) {
			const getErc721 = async () => {
				setIsLoading(true);
				try {
					const result = await getMyriaErc721ByStarkKey(client, starkKey);
					setAssets(result);
				} catch (err: any) {
					setErr(err.message);
				} finally {
					setIsLoading(false);
					setIsLoaded(true);
				}
			}
			getErc721();
		}
	}, []);

	const onWithdraw = async (asset: any) => {
		return await withdrawErc721(client, asset, account, starkKey);
	}

	const onList = async (asset: any) => {
		return await listErc721(client, account, starkKey, asset);
	}

	const onBulkList = async () => {
		return await bulkListErc721(client, account, starkKey, assets);
	}

	return (
		<div>
			{err && <code className="mt-3">{err}</code>}

			{!isConnected && <p>Please connect your wallet first!</p>}

			{isLoading && <p>Loading assets...</p>}

			<div className="row text-center mt-3">
				{(assets && Array.isArray(assets) && isLoaded)
					?
					<>
						<div className="row">
							<div className="col mb-3">
								<button className="btn-mry" onClick={() => onBulkList()}>Bulk list NFTs</button>
							</div>
						</div>
						{assets.map((asset: any) => (
							<div className="col mb-3" key={asset.id}>
								<ImageCard
									item={asset}
									onButtonClick1={() => onWithdraw(asset)}
									buttonTitle1="Withdraw NFT"
									onButtonClick2={() => onList(asset.id)}
									buttonTitle2="List NFT"
									title={asset.name}
								/>

							</div>
						))}
					</>
					: (isLoaded && !(Array.isArray(assets)) && <p>No assets available</p>)
				}
			</div>
		</div>
	);
}

export default MyriaAssets;