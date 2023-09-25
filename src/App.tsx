import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./views/Main";
import useMetamask from "./helpers/useMetamask";
import Navbar from "./components/Navbar";
import MyriaAssets from "./views/MyriaAssets";
import Erc721Withdrawals from "./views/Erc721Withdrawals";
import Wallet from "./views/WalletERC20";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./assets/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const {
    isConnected,
    starkKey,
    connectL2Wallet,
    walletAdrress,
    myriaClient,
    netWorkIdUser,
    setNetWorkIdByUser
  } = useMetamask();

  const navbarItems = [
    {
      title: "Wallet ERC20",
      url: "/wallet-erc20",
    },
    {
      title: "Myria L2 Assets",
      url: "/myria-assets",
    },
    // {
    //   title: "Ethereum L1 assets",
    //   url: "/eth-assets"
    // },
    // {
    //   title: "Withdrawals",
    //   url: "/withdrawals"
    // },
  ];


  return (
    <div>
      <ToastContainer hideProgressBar />
      <Navbar
        title="Myria React Samples"
        items={navbarItems}
        onButtonClick={async () => await connectL2Wallet()}
        buttonTitle={
          isConnected
            ? `${walletAdrress.slice(0, 5)}...${walletAdrress.slice(38, 42)}`
            : "Connect Wallet"
        }
        isConnectedWallet={isConnected}
        netWorkIdUser={netWorkIdUser}
        setNetWorkIdByUser={setNetWorkIdByUser}
      />
      <div className="container mx-auto mt-3">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isConnected={isConnected}
                account={walletAdrress}
                starkKey={starkKey}
                client={myriaClient}
                />
            }
          />
          <Route
            path="/wallet-erc20"
            element={
              <Wallet
                isConnected={isConnected}
                account={walletAdrress}
                starkKey={starkKey}
                client={myriaClient}
              />
            }
          />
          <Route
            path="/myria-assets"
            element={
              <MyriaAssets
                isConnected={isConnected}
                account={walletAdrress}
                starkKey={starkKey}
                client={myriaClient}
              />
            }
          />
          {/* <Route path="/eth-assets" element={<EthAssets isConnected={isConnected} account={account} starkKey={starkKey} client={client} />} /> */}
          <Route
            path="/withdrawals"
            element={
              <Erc721Withdrawals
                isConnected={isConnected}
                account={walletAdrress}
                starkKey={starkKey}
                client={myriaClient}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
