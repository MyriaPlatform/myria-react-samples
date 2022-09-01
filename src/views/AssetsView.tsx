import { useState } from "react";
import { getAssetsByOwnerPublicKey } from "../samples/assets/assets-by-public-key";
import { getMyriaClient } from "../samples/common/myria-client";
import '../assets/styles.css';

type Props = {
	isConnected: boolean,
	account: string
}

function AssetsView({ isConnected, account }: Props) {
	const [nfts, setNfts] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [err, setErr] = useState('');

	const getAssets = async () => {
		setIsLoading(true);

		try {
			const client = await getMyriaClient(isConnected);
			const result = await getAssetsByOwnerPublicKey(client, account);
			setNfts(result);
		} catch (err: any) {
			setErr(err.message);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div>
			<button onClick={getAssets}>Get Assets</button>

			{err && <h3>{err}</h3>}

			{isLoading && <h3>Loading...</h3>}

			{(Array.isArray(nfts) && !isLoading)
				? nfts.map(nft => (
					<ul key={nft.id}>
						<li>Id: {nft.id}</li>
						<li>Name: {nft.name}</li>
						<li>Token id: {nft.tokenId}</li>
						<li>Token address: {nft.tokenAddress}</li>
						<li>Asset id: {nft.assetMintId}</li>
						<li>Vault Id: ?</li>
						<li>Quantized Amount: ?</li>
					</ul>
				))
				: null
			}
		</div>
	);
}

export default AssetsView;
