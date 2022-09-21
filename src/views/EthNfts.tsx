import { MyriaClient } from 'myria-core-sdk';
import { useEffect, useState } from 'react';
import { depositErc721 } from '../samples/nfts/deposit-nft';
import { getEthNfts } from "../samples/nfts/get-eth-nfts";

type Props = {
	isConnected: boolean,
	account: string,
	starkKey: string,
	client: MyriaClient
}

const EthNfts = ({ isConnected, account, client, starkKey }: Props) => {
	const [assets, setAssets] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [err, setErr] = useState('');

	useEffect(() => {
		if (isConnected) {
			const getAssets = async () => {
				setIsLoading(true);
				try {
					const result = await getEthNfts(account);
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

	const depositNft = async (asset: any) => {
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
							<div className="card" style={{ width: "16rem" }}>
								<div className="card-body">
									<h5 className="card-title">#{asset.tokenId}</h5>
									<p className="card-text">{asset.contract.address}</p>
									{
										(asset.transactionStatus === "Pending") ? "" :
											<a className="card-link" onClick={() => depositNft(asset)}>Deposit to Myria</a>
									}
								</div>
								<div className="card-footer">
									<small className="text-muted">{asset.tokenType}</small>
								</div>
							</div>
						</div>
					))
					: (isLoaded && (!assets.length) && <p>No assets available</p>)
				}
			</div>
		</div>
	);
}

export default EthNfts;