import { useEffect } from 'react';
import { useState } from "react";
import { getAssetsByStarkKey } from "../samples/assets/assets-by-stark-key";
import { withdrawErc721 } from "../samples/assets/withdraw-erc721";
import { getMyriaClient } from '../samples/common/myria-client';

type Props = {
	isConnected: boolean,
	account: string
}

function AssetsView({ account, isConnected }: Props) {
	const [nfts, setNfts] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [err, setErr] = useState('');

	useEffect(() => {
		const getNfts = async () => {
			setIsLoading(true);
			try {
				const client = await getMyriaClient(isConnected);
				const result = await getAssetsByStarkKey(client, account);
				setNfts(result);
			} catch (err: any) {
				setErr(err.message);
			} finally {
				setIsLoading(false);
				setIsLoaded(true);
			}
		}

		getNfts();
	}, []);

	const withdrawNft = async (param: any) => {
		const client = await getMyriaClient(isConnected);
		const withdrawalResult = await withdrawErc721(client, param, account);
		console.log(withdrawalResult);
	}

	return (
		<div>
			{err && <code className="mt-3">{err}</code>}

			{isLoading && <p>Loading assets...</p>}
			
			<div className="row align-items-start text-center mt-3">
				{(Array.isArray(nfts) && isLoaded)
					? nfts.map((nft: any) => (
						<div className="col mb-3" key={nft.id}>
							<div className="card" key={nft.id} style={{ width: "14rem" }}>
								<img src={nft.imageUrl ? nft.imageUrl : "/null.png"} alt={nft.name} className="card-img-top img-thumbnail" />
								<div className="card-body">
									<h5 className="card-title">{nft.name}</h5>
									<p className="card-text">{nft.description}</p>
									<a className="card-link" onClick={() => withdrawNft(nft)}>Withdraw NFT</a>
									<a className="card-link">List NFT</a>
								</div>
								<div className="card-footer">
									<small className="text-muted">#{nft.id} | {nft.publicId}</small>
								</div>
							</div>
						</div>
					))
					: (isLoaded && !(Array.isArray(nfts)) && <p>No assets available</p>)
				}
			</div>
		</div>
	);
}

export default AssetsView;