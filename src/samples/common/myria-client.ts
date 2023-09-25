import { EnvTypes, IMyriaClient, MyriaClient } from "myria-core-sdk";
import Web3 from "web3";

async function initWeb3Instance(isConnected: boolean) {
	if (isConnected) {
		console.log("Initializing a Web3 provider...");
		let windowBrowser;
		if (window && window.ethereum) {
			windowBrowser = new Web3(Web3.givenProvider);
			window.web3 = windowBrowser;
		} else {
			console.log("Couldn't set a Web3 provider");
			return;
		}
		return windowBrowser;
	} else {
		console.log("Please connect your Metamask first");
	}
}

export async function getMyriaClient(isConnected: boolean) {
	const web3Instance = await initWeb3Instance(isConnected);
	const networkId = await web3Instance.eth.net.getId();

	const client: IMyriaClient = {
		provider: web3Instance.eth.currentProvider as any,
		networkId: networkId,
		web3: web3Instance as any,
		env: networkId === 1 ? EnvTypes.PRODUCTION : EnvTypes.STAGING
	};

	const myriaClient = new MyriaClient(client);
	return myriaClient;
}