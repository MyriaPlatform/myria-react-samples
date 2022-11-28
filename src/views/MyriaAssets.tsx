import { MyriaClient } from 'myria-core-sdk';
import { useEffect, useState } from 'react';
import { getMyriaErc721ByStarkKey } from "../samples/assets/get-myria-erc721";
import { listErc721 } from '../samples/assets/list-erc721';
import { bulkListErc721 } from '../samples/assets/bulk-list-erc721';
import { withdrawErc721 } from "../samples/assets/withdraw-erc721";
import ImageCard from '../components/ImageCard';

type Props = {
	isConnected: boolean,
	account: string,
	starkKey: string,
	client: MyriaClient
}

const MyriaAssets = ({ isConnected, account, starkKey, client }: Props) => {
	const [price, setPrice] = useState<any>("0.001");
	const [startIndex, setStartIndex] = useState<any>(0);
	const [endIndex, setEndIndex] = useState<any>(0);

	const [assets, setAssets] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [err, setErr] = useState('');

	useEffect(() => {
		if (isConnected) {
			const getErc721 = async () => {
				setIsLoading(true);
				try {
					await getMyriaErc721ByStarkKey(client, starkKey).then((data) => {
						if (typeof (data) !== undefined) {
							setAssets(data);
						}
					});
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

	const onBulkList = async (price: string, startIndex: number, endIndex: number) => {
		return await bulkListErc721(client, account, starkKey, assets, price, startIndex, endIndex);
	}

	const onPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPrice(event.target.value);
	};

	const onEndIndexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEndIndex(event.target.value);
	};

	const onStartIndexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setStartIndex(event.target.value);
	};

	return (
		<div>
			{err && <code className="mt-3">{err}</code>}

			{!isConnected && <p>Please connect your wallet first!</p>}

			{isLoading && <p>Loading assets...</p>}

			<div className="row text-center mt-3">
				{(assets && isLoaded)
					?
					<>
						<div className="row py-3 mb-3 list-form">
							<div className="row">
								<div className="col">
									<input type="number" name="startIndex" min="0" value={startIndex} onChange={onStartIndexChange} className="form-control" placeholder="Start index" />
								</div>
								<div className="col">
									<input type="number" name="endIndex" min="0" value={endIndex} onChange={onEndIndexChange} className="form-control" placeholder="End index" />
								</div>
								<div className="col">
									<input type="text" name="price" value={price} onChange={onPriceChange} className="form-control" placeholder="Price" />
								</div>
								<div className="col">
									<button className="btn-mry" onClick={() => onBulkList(price, startIndex, endIndex)}>Bulk list NFTs</button>
								</div>
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
									footer={`${asset.id} | ${asset.publicId}`}
								/>

							</div>
						))}
					</>
					: (isLoaded && !assets && <p>No assets available</p>)
				}
			</div>
		</div>
	);
}

export default MyriaAssets;