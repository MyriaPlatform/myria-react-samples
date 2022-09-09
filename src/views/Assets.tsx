import { useEffect, useState } from 'react';
import { getAssetsByStarkKey } from "../samples/assets/assets-by-stark-key";
import { listErc721 } from '../samples/assets/list-erc721';
import { withdrawErc721 } from "../samples/assets/withdraw-erc721";
import { getMyriaClient } from '../samples/common/myria-client';

type Props = {
	isConnected: boolean,
	account: string,
	starkKey: string
}

const Assets = ({ isConnected, account, starkKey }: Props) => {
	const [assets, setAssets] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [err, setErr] = useState('');

	useEffect(() => {
		if(isConnected) {
			const getNfts = async () => {
				setIsLoading(true);
				try {
					const client = await getMyriaClient(isConnected);
					const result = await getAssetsByStarkKey(client, starkKey);
					setAssets(result);
				} catch (err: any) {
					setErr(err.message);
				} finally {
					setIsLoading(false);
					setIsLoaded(true);
				}
			}
			getNfts();
		}
	}, []);

	const withdrawNft = async (asset: any) => {
		const client = await getMyriaClient(isConnected);
		const withdrawalResult = await withdrawErc721(client, asset, account, starkKey);
		console.log(withdrawalResult);
	}

	const listNft = async (asset: any) => {
		const client = await getMyriaClient(isConnected);
		const result = await listErc721(client, account, starkKey, asset);
		console.log(result);
	}

	return (
		<div>
			{err && <code className="mt-3">{err}</code>}

			{!isConnected && <p>Please connect your wallet first!</p>}

			{isLoading && <p>Loading assets...</p>}

			<div className="row align-items-start text-center mt-3">
				{(Array.isArray(assets) && isLoaded)
					? assets.map((asset: any) => (
						<div className="col mb-3" key={asset.id}>
							<div className="card" key={asset.id} style={{ width: "14rem" }}>
								<img src={asset.imageUrl ? asset.imageUrl : "/null.png"} alt={asset.name} className="card-img-top img-thumbnail" />
								<div className="card-body">
									<h5 className="card-title">{asset.name}</h5>
									<p className="card-text">{asset.description}</p>
									<a className="card-link" onClick={() => withdrawNft(asset)}>Withdraw NFT</a>
									<a className="card-link" onClick={() => listNft(asset)}>List NFT</a>
								</div>
								<div className="card-footer">
									<small className="text-muted">#{asset.id} | {asset.publicId}</small>
								</div>
							</div>
						</div>
					))
					: (isLoaded && !(Array.isArray(assets)) && <p>No assets available</p>)
				}
			</div>
		</div>
	);
}

export default Assets;