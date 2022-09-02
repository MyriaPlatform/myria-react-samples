import { useEffect } from 'react';
import { useState } from "react";
import { getAssetsByStarkKey } from "../samples/assets/assets-by-stark-key";
import { withdrawErc721 } from "../samples/assets/withdraw-erc721";
import { getMyriaClient } from "../samples/common/myria-client";

type Props = {
	isConnected: boolean,
	account: string
}

function AssetsView({ isConnected, account }: Props) {
	const [nfts, setNfts] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [err, setErr] = useState('');

	useEffect(() => {
		getNfts();
	}, []);

	const getNfts = async () => {
		setIsLoading(true);

		try {
			const client = await getMyriaClient(isConnected);
			const result = await getAssetsByStarkKey(client);
			setNfts(result);
		} catch (err: any) {
			setErr(err.message);
		} finally {
			setIsLoading(false);
			setIsLoaded(true);
		}
	}

	const withdrawNft = async (param: any) => {
		const client = await getMyriaClient(isConnected);
		const withdrawalResult = await withdrawErc721(client, param, account);
		console.log(withdrawalResult);
	}

	return (
		<div>
			{err && <h3>{err}</h3>}

			{isLoading && <h3>Loading assets...</h3>}

			<div className="bg-white">
				<div className="mx-auto lg:max-w-7xl">
					<h2 className="sr-only">Products</h2>
					<div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
						{(Array.isArray(nfts) && isLoaded)
							? nfts.map((nft: any) => (
								<div key={nft.id} className="group relative">
									<div className="min-h-72 w-fit overflow-hidden rounded-md bg-gray-200">
										<img
											src={nft.metadataOptional.image}
											alt={nft.name}
											className="h-72 w-fit object-cover object-center"
										/>
									</div>
									<div className="mt-4 flex">
										<div>
											<h3 className="text-sm text-gray-700">
												<span className="" />
												{nft.name}
											</h3>
											<button className="mt-1 text-sm text-gray-500" onClick={() => withdrawNft(nft)}>Withdraw</button>
										</div>
										<p className="text-sm font-medium text-gray-900">#{nft.id}</p>
									</div>
								</div>
							))
							: (isLoaded && !(Array.isArray(nfts)) && <p>No assets available</p>)
						}
					</div>
				</div>
			</div>
		</div>
	);
}

export default AssetsView;