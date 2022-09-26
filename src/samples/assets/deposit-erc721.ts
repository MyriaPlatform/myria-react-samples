import { DepositERC721Params, DepositModule, MyriaClient, TokenType} from "myria-core-sdk";

export async function depositErc721(client: MyriaClient, starkKey: string, tokenAddress: string, tokenId: string) {
	const depositModule: DepositModule = new DepositModule(client);

	const params: DepositERC721Params = {
		starkKey: starkKey,
    tokenType: TokenType.MINTABLE_ERC721,
    tokenAddress: tokenAddress,
    vaultId: "",
    tokenId: tokenId
	}

	console.log(params);

	let depositResponse;
	try {
		console.log("Depositing the ERC721...");
		depositResponse = await depositModule.depositNFT(params)
		if(depositResponse) {
			console.log("Deposit response:");
			console.log(JSON.stringify(depositResponse, null, 2));
		}

		return depositResponse;
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message);
		}
		return;
	}
}
