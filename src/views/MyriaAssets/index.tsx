import {
  CollectionManager,
  GetAssetByCollectionParams,
  MyriaClient,
  TokenType,
} from "myria-core-sdk";
import { useEffect, useMemo, useState } from "react";
import ImageCard from "../../components/ImageCard";
import { getMyriaErc721ByStarkKey } from "../../samples/assets/get-myria-erc721";
import { listErc721 } from "../../samples/assets/list-erc721";
import { bulkListErc721 } from "../../samples/assets/bulk-list-erc721";
import { withdrawErc721 } from "../../samples/assets/withdraw-erc721";
import { useQuery } from "@tanstack/react-query";
import CurrencySelector from "../../components/CurrencySelector";
import ETHWhite from "../../icons/ETHWhite";
import { IOptionsAsset, TOption } from "../../utils/utils";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import style from "./style.module.css";

export const optionsAsset: IOptionsAsset = {
  [TokenType.ETH]: {
    id: 1,
    name: "Ethereum",
    short: "ETH",
    ico: "/eth.svg",
    // tokenAddress: "",
    // assetType: ETH_TOKEN.assetType,
    tokenType: TokenType.ETH,
    iconComponent: (props: string) => <ETHWhite className={props} />,
  },
  [TokenType.ERC20]: {
    id: 2,
    name: "MYRIA",
    short: "Myria",
    ico: "/myria-icon-logo.png",
    // tokenAddress: MYRIA_TOKEN.tokenAddress,
    // assetType: MYRIA_TOKEN.assetType,
    tokenType: TokenType.ERC20,
    iconComponent: (props: string) => (
      <img src={"/myria-icon-logo.png"} alt="" className={props} />
    ),
  },
};

type Props = {
  isConnected: boolean;
  account: string;
  starkKey: string;
  client: MyriaClient;
};

const MyriaAssets = ({ isConnected, account, starkKey, client }: Props) => {
  const [price, setPrice] = useState<any>("0.001");

  const [assets, setAssets] = useState<any[]>([]);
  const [selectedToken, setSelectedToken] = useState<TOption>(
    optionsAsset[TokenType.ETH]
  );
  const [inputCollectionId, setInputCollectionId] = useState<string>("");
  const [inputCurrentPage, setInputCurrentPage] = useState<number>(1);
  const [inputLimitPerPage, setInputLimitPerPage] = useState<number>(10);
  const [loadingBulkListing, setLoadingBulkListing] = useState<boolean>(false);

  const selectCurrency = (param: any) => {
    setSelectedToken(param);
  };

  const getErc721 = async (inputCollectionId: string) => {
    let data: any;
    if (inputCollectionId && inputCollectionId.length > 0) {
      const listAssetData = await getListAssetByCollectionId();
      if (listAssetData.data.items) {
        data = listAssetData.data.items;
      } else data = [];
    } else {
      data = await getMyriaErc721ByStarkKey(
        client,
        starkKey,
        inputCurrentPage,
        inputLimitPerPage
      );
    }
    if (data) {
      const assetDatas = data.map((assetData: any, idx: number) => {
        return { ...assetData, isSelectedBulkList: false };
      });
      return assetDatas;
    } else {
      return [];
    }
  };

  const getListAssetByCollectionId = async () => {
    const payload: GetAssetByCollectionParams = {
      collectionId: Number(inputCollectionId),
      assetType: "ALL",
      limit: inputLimitPerPage,
      page: inputCurrentPage,
      assetTypeOutput: "ASSETS",
    };
    const collectionManager: CollectionManager = new CollectionManager(
      client.env
    );
    return collectionManager.getAssetByCollectionId(payload);
  };

  const {
    data: dataQueryGetERC721,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["queryAssets"],
    queryFn: async () => await getErc721(inputCollectionId),
    enabled: isConnected && client?.env.length > 0 && starkKey.length > 10,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (dataQueryGetERC721) {
      const assetDatas = dataQueryGetERC721.map(
        (assetData: any, idx: number) => {
          return { ...assetData, isSelectedBulkList: false };
        }
      );
      setAssets(assetDatas);
    }
  }, [dataQueryGetERC721]);

  const isSelectedAll = useMemo(() => {
    let isSelectedAll = assets.every((assetData) => {
      if (
        !assetData.isSelectedBulkList &&
        !(assetData.order && assetData.order?.length > 0)
      ) {
        return false;
      }
      return true;
    });
    return isSelectedAll;
  }, [assets]);

  const onWithdraw = async (asset: any) => {
    return await withdrawErc721(client, asset, account, starkKey);
  };

  const onList = async (asset: any, price: string) => {
    try {
      await listErc721(
        client,
        account,
        starkKey,
        asset,
        price,
        selectedToken.tokenType
      );
      await refetch();
    } catch (error) {}
  };

  const onSelectList = (index: number, statusCheck: boolean) => {
    const newAsset = assets.map((asset: any, idx: number) => {
      if (index === idx) return { ...asset, isSelectedBulkList: statusCheck };
      return asset;
    });
    setAssets(newAsset);
  };

  const handleSelectAllList = () => {
    const newAsset = assets.map((asset: any, idx: number) => {
      if (asset.order && asset.order?.length > 0) {
        return { ...asset };
      }
      return { ...asset, isSelectedBulkList: !isSelectedAll };
    });
    setAssets(newAsset);
  };

  const onBulkList = async (price: string) => {
    const assetSelectList = assets.filter((assetData: any) => {
      return assetData.isSelectedBulkList === true;
    });
    if (assetSelectList.length === 0) {
      toast.warning("Please select asset to listing!");
      return;
    }
    setLoadingBulkListing(true);
    try {
      await bulkListErc721(
        client,
        account,
        starkKey,
        assetSelectList,
        price,
        selectedToken.tokenType
      );
      toast.success("Listing success!");
      await refetch();
      setLoadingBulkListing(false);
    } catch (error) {
      console.log("Listing error: ", error);
      toast.error("Listing failed. Please check exception and try again !");
      setLoadingBulkListing(false);
    }
  };

  const onPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };

  const onCollectionIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputCollectionId(event.target.value);
  };

  const onCurrentPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputCurrentPage(Number(event.target.value));
  };

  const onLimitPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLimitPerPage(Number(event.target.value));
  };

  const handleGetAssetByCollectionId = async () => {
    await refetch();
  };

  return (
    <div>
      {!isConnected && <p>Please connect your wallet first!</p>}
      <div className="row text-center mt-3">
        {assets && isConnected ? (
          <>
            <div className="row py-3 mb-3 list-form">
              <div className="row align-items-center">
                <div className="col">
                  <input
                    type="text"
                    name="price"
                    value={price}
                    onChange={onPriceChange}
                    className="form-control"
                    placeholder="Price"
                  />
                </div>
                <div className="col">
                  <CurrencySelector
                    className={"col"}
                    options={optionsAsset}
                    selectHandle={selectCurrency}
                    defaultSelectedOption={selectedToken}
                  />
                </div>
                <div className="col d-flex flex-col align-items-center">
                  <input
                    onChange={handleSelectAllList}
                    className={`form-check-input`}
                    type="checkbox"
                    checked={isSelectedAll}
                    id="flexCheckDefault"
                  />
                  <p className="ms-2 mb-0">Select All</p>
                </div>
                <div className="col d-flex align-items-end justify-content-center justify-content-md-end">
                  <button
                    disabled={loadingBulkListing}
                    className={`btn-mry bg-warning fw-bold text-dark d-flex align-items-center justify-content-center ${style.btnListing}`}
                    onClick={() => onBulkList(price)}
                  >
                    {loadingBulkListing ? <Loading /> : "Bulk list NFTs"}
                  </button>
                </div>
              </div>
              <div className="row mt-4 align-items-end">
                <div className="col">
                  <p className="text-white mb-2">Collection ID</p>
                  <input
                    type="number"
                    name="collectionId"
                    min="0"
                    value={inputCollectionId}
                    onChange={onCollectionIdChange}
                    className="form-control"
                    placeholder="Collection id"
                  />
                </div>
                <div className="col">
                  <p className="text-white mb-2">Current page</p>
                  <input
                    type="number"
                    name="currentPage"
                    min="0"
                    value={inputCurrentPage}
                    onChange={onCurrentPageChange}
                    className="form-control"
                    placeholder="Current page"
                  />
                </div>
                <div className="col">
                  <p className="text-white mb-2">Limit items per page</p>
                  <input
                    type="number"
                    name="itemperpage"
                    min="0"
                    value={inputLimitPerPage}
                    onChange={onLimitPerPageChange}
                    className="form-control"
                    placeholder="Limit item per page"
                  />
                </div>
                <div className="col d-flex align-items-end justify-content-end">
                  <button
                    className="btn-mry bg-warning fw-bold text-dark"
                    style={{ width: "96px", height: "48px" }}
                    onClick={handleGetAssetByCollectionId}
                    disabled={isFetching}
                  >
                    {isFetching ? <Loading /> : "Search"}
                  </button>
                </div>
              </div>
            </div>
            {assets.length === 0 ? <p>No assets available</p> : null}
            {isFetching ? (
              <Loading labelSize={16} loadingSize={32} />
            ) : (
              assets.map((asset: any, index: number) => (
                <div
                  className="col-12 col-md-6 col-lg-3 mb-3 d-flex justify-content-between"
                  key={asset.id}
                >
                  <ImageCard
                    client={client}
                    item={asset}
                    index={index}
                    onButtonClick1={async () => onWithdraw(asset)}
                    buttonTitle1="Withdraw NFT"
                    onButtonClick2={async () => onList(asset.id, price)}
                    buttonTitle2="List NFT"
                    title={asset.name}
                    footer={`${asset.id} | ${asset.publicId}`}
                    isSelected={asset.isSelectedBulkList}
                    onSelectList={onSelectList}
                    disabled={asset.order?.length > 0}
                  />
                </div>
              ))
            )}
          </>
        ) : (
          !assets && <p>No assets available</p>
        )}
      </div>
      {/* )} */}
    </div>
  );
};

export default MyriaAssets;
