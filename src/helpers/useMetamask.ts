import { useState } from "react";

const useMetamask = () => {
	const [isInstalled, setIsInstalled] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [account, setAccount] = useState("0x");

	const checkIfMetaMaskInstalled = () => {
		const { ethereum } = window;
		if (Boolean(ethereum && ethereum.isMetaMask)) {
			setIsInstalled(true);
			return true;
		} else {
			alert("No MetaMask detected. Please install and proceed!");
			return false;
		}
	}

	const checkIfMetaMaskConnected = async () => {
		if (isInstalled && typeof window.ethereum !== "undefined") {
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			if (accounts.length) {
				setIsConnected(true);
				setAccount(accounts[0]);
				console.log("Metamask is connected");
				return true;
			}
		}
	}

	const setMetaMaskAccount = () => {
		return account;
	}

	return {
		checkIfMetaMaskInstalled,
		checkIfMetaMaskConnected,
		setMetaMaskAccount,
		isInstalled,
		isConnected,
		account
	}
};

export default useMetamask;