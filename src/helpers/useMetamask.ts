import WalletConnectProvider from "@walletconnect/web3-provider";
import { useState } from "react";
import { toast } from "react-toastify";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { getModuleFactory, signMetamask } from "./myriaCoreSDK";
import { MyriaClient, Networks, UserDataResponse } from "myria-core-sdk";
import { getMyriaClient } from "../samples/common/myria-client";

export const changeNetwork = async (provider: any, ENV_CHAIN_ID: number) => {
  const chainId = ENV_CHAIN_ID;
  const changeIdHex = "0x" + chainId.toString(16);
  try {
    await provider?.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: changeIdHex,
        },
      ],
    });
  } catch (err: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (err.code === 4902) {
      await provider?.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: changeIdHex,
          },
        ],
      });
    } else {
      throw err;
    }
  }
};

const getProviderOptions = () => ({
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
    },
  },
});

export enum NetworkID {
  MAINNET = Networks.MAINNET,
  GOERLI = Networks.GOERLI,
  SEPOLIA = Networks.SEPOLIA
}

const useMetamask = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAdrress, setWalletAddress] = useState("0x");
  const [starkKey, setStarkKey] = useState("0x");
  const [myriaClient, setMyriaClient] = useState<MyriaClient>(null);
  const [netWorkIdUser, setNetWorkIdByUser] = useState<NetworkID>(NetworkID.MAINNET);
  const checkIfMetaMaskInstalled = () => {
    const { ethereum } = window;
    if (Boolean(ethereum && ethereum.isMetaMask)) {
      return true;
    } else {
      return false;
    }
  };

  const loginL2Wallet = async (
    metamaskAccount: string
  ): Promise<UserDataResponse | undefined> => {
    const moduleFactory = await getModuleFactory();
    if (!moduleFactory) return;
    const userModule = moduleFactory.getUserManager();
    try {
      const user = await userModule.getUserByWalletAddress(metamaskAccount);
      if (
        user &&
        user?.ethAddress?.toLowerCase() === metamaskAccount?.toLowerCase()
      ) {
        return user;
      } else {
        return undefined;
      }
    } catch {
      toast(
        "Login Failed, This Account is not existed. Please register on the Myria website.",
        {
          type: "error",
        }
      );
      return undefined;
    }
  };

  async function connectL2Wallet() {
    const tWebModal = new Web3Modal({
      network: netWorkIdUser === NetworkID.MAINNET ? "MAINNET" : "SEPOLIA",
      cacheProvider: true,
      providerOptions: getProviderOptions(),
    });
    const provider = await tWebModal.connect();
    const providerApi = new ethers.providers.Web3Provider(provider);
    const network = await providerApi.getNetwork();
    if (network.chainId !== netWorkIdUser) {
      await changeNetwork(provider, netWorkIdUser);
    }
    if (checkIfMetaMaskInstalled()) {
      const accounts = await signMetamask();
      if (!accounts || accounts.length === 0) return;
      const currentAccount = accounts[0];
      const moduleFactory = await getModuleFactory();
      if (!moduleFactory) return;
      const commonModule = moduleFactory.getCommonModule();
      const getStarkKey = await commonModule.generateStarkKey(currentAccount);
      const statusLoginL2Wallet = await loginL2Wallet(currentAccount);
      if (statusLoginL2Wallet === undefined) return;
      if (
        statusLoginL2Wallet &&
        "0x" + getStarkKey === statusLoginL2Wallet.starkKey
      ) {
        //Keep status login
        toast("Login Success", {
          type: "success",
        });
        setIsConnected(true);
        const sampleClient = await getMyriaClient(true);
        setWalletAddress(statusLoginL2Wallet.ethAddress);
        setStarkKey(statusLoginL2Wallet.starkKey);
        setMyriaClient(sampleClient);
      } else {
        toast(
          "Login failed, The stark key is mismatch. Please switch with correct wallet.",
          {
            type: "error",
          }
        );
        disconnectL2Wallet();
      }
    } else {
      toast("Please install Metamask before connect wallet", {
        type: "warning",
      });
    }
  }
  async function disconnectL2Wallet() {
    setIsConnected(false);
    setWalletAddress("0x");
    setStarkKey("0x");
  }

  return {
    connectL2Wallet,
    isConnected,
    walletAdrress,
    starkKey,
    myriaClient,
    netWorkIdUser,
    setNetWorkIdByUser,
  };
};

export default useMetamask;
