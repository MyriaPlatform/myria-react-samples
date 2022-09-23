import { MyriaClient } from 'myria-core-sdk';
import { useEffect, useState } from 'react';
import { getMyriaNftsByStarkKey } from "../samples/nfts/get-myria-nfts";
import { listErc721 } from '../samples/nfts/list-nft';
import { withdrawErc721 } from "../samples/nfts/withdraw-nft";

type Props = {
	isConnected: boolean,
	account: string,
	starkKey: string,
	client: MyriaClient
}

const MyriaNfts = ({ isConnected, account, starkKey, client }: Props) => {
	const [assets, setAssets] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [err, setErr] = useState('');

	useEffect(() => {
		if(isConnected) {
			const getNfts = async () => {
				setIsLoading(true);
				try {
					const result = await getMyriaNftsByStarkKey(client, starkKey);
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
		const withdrawalResult = await withdrawErc721(client, asset, account, starkKey);
		console.log(withdrawalResult);
	}

	const listNft = async (asset: any) => {
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
							<div className="card mry-card" key={asset.id} style={{ width: "14rem" }}>
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

export default MyriaNfts;