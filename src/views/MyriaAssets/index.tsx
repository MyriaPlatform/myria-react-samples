import {
  CollectionManager,
  GetAssetByCollectionParams,
  MyriaClient,
  TokenType,
} from "myria-core-sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import ImageCard from "../../components/ImageCard";
import { getMyriaErc721ByStarkKey } from "../../samples/assets/get-myria-erc721";
import { listErc721 } from "../../samples/assets/list-erc721";
import { bulkListErc721 } from "../../samples/assets/bulk-list-erc721";
import { useQuery } from "@tanstack/react-query";
import CurrencySelector from "../../components/CurrencySelector";
import ETHWhite from "../../icons/ETHWhite";
import { IOptionsAsset, TOption } from "../../utils/utils";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import style from "./style.module.css";
import { bulkUnListErc721 } from "../../samples/assets/bulk-unlist-erc721";
import { unListErc721 } from "../../samples/assets/unlist-erc721";

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
export const optionsSelect: IOptionsAsset = {
  listing: {
    id: 3,
    name: "Listing",
    short: "",
    ico: "",
  },
  unlisting: {
    id: 4,
    name: "Unlisting",
    short: "",
    ico: "",
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
  const [isListing, setIsListing] = useState<boolean>(true);

  const [assets, setAssets] = useState<any[]>([]);
  const [selectedToken, setSelectedToken] = useState<TOption>(
    optionsAsset[TokenType.ETH]
  );
  const [inputCollectionId, setInputCollectionId] = useState<string>("");
  const [inputCurrentPage, setInputCurrentPage] = useState<number>(1);
  const [inputLimitPerPage, setInputLimitPerPage] = useState<number>(10);
  const [loadingBulkHandle, setLoadingBulkHandle] = useState<boolean>(false);

  const selectCurrency = (param: any) => {
    setSelectedToken(param);
  };
  const selectListingOption = async(param: any) => {
    setIsListing(param.id === 3);
    localStorage.setItem("isListing", String(param.id))
    await refetch();
  };

  const getErc721 = async (valueCollectionId: string) => {
    let data: any;
    if (valueCollectionId && valueCollectionId.length > 0) {
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
        return { ...assetData, isSelectedBulk: false };
      });
      return assetDatas;
    } else {
      return [];
    }
  };

  const getListAssetByCollectionId = useCallback(async () => {
    const isListingValue = localStorage.getItem("isListing")
    const payload: GetAssetByCollectionParams = {
      collectionId: Number(inputCollectionId),
      assetType: Number(isListingValue) === 4 ? "FOR_SALE" : "ALL",
      limit: inputLimitPerPage,
      page: inputCurrentPage,
      assetTypeOutput: "ASSETS",
    };
    const collectionManager: CollectionManager = new CollectionManager(
      client.env
    );
    return collectionManager.getAssetByCollectionId(payload);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListing, inputCollectionId]);

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
      const assetData = dataQueryGetERC721
        .map((assetData: any, idx: number) => {
          return { ...assetData, isSelectedBulk: false };
        })
        .sort((assetData1: any, assetData2: any) => {
          if (assetData1.order && (!!assetData1.order?.id || assetData1.order?.length)) {
            return 1;
          } else {
            return -1;
          }
        })
        .filter((assetData: any) => {
          return isListing
            ? true
            : assetData.order && (assetData.order?.length > 0 || !!assetData.order?.id);
        });
      setAssets(assetData);
    }
  }, [dataQueryGetERC721, isListing]);
  

  const isSelectedAll = useMemo(() => {
    const isSelectedAll = assets.every((assetData) => {
      if (isListing) {
        if (
          !assetData.isSelectedBulk &&
          !(assetData.order && (!!assetData.order?.id || assetData.order?.length > 0))
        ) {
          return false;
        }
        return true;
      } else {
        if (
          !assetData.isSelectedBulk &&
          assetData.order && (assetData.order?.id || assetData.order?.length > 0)
        ) {
          return false;
        }
        return true;
      }
    });
    return isSelectedAll;
  }, [assets, isListing]);

  const numberSelect = useMemo(() => {
    const numberSelect = assets.reduce((prevValue, assetData: any) => {
      if (isListing) {
        if (
          !(assetData.order && (!!assetData.order.id || assetData.order?.length > 0)) &&
          assetData.isSelectedBulk
        ) {
          return prevValue + 1;
        }
        return prevValue;
      } else {
        if (
          assetData.order &&
          (!!assetData.order.id || assetData.order?.length > 0) &&
          assetData.isSelectedBulk
        ) {
          return prevValue + 1;
        }
        return prevValue;
      }
    }, 0);
    return numberSelect;
  }, [assets, isListing]);

  const numberAvailableAssets = useMemo(() => {
    const numberSelect = assets.reduce((prevValue, assetData: any) => {
      if (isListing) {
        if (!(assetData.order && (!!assetData.order?.id || assetData.order?.length > 0))) {
          return prevValue + 1;
        }
        return prevValue;
      } else {
        if (assetData.order && (!!assetData.order?.id || assetData.order?.length > 0)) {
          return prevValue + 1;
        }
        return prevValue;
      }
    }, 0);
    return numberSelect;
  }, [assets, isListing]);

  // const onWithdraw = async (asset: any) => {
  //   return await withdrawErc721(client, asset, account, starkKey);
  // };

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
  const onUnListing = async (asset: any) => {
    try {
      await unListErc721(client, account, asset);
      await refetch();
    } catch (error) {
    }
  };

  const onSelectItem = (index: number, statusCheck: boolean) => {
    const newAsset = assets.map((asset: any, idx: number) => {
      if (index === idx) return { ...asset, isSelectedBulk: statusCheck };
      return asset;
    });
    setAssets(newAsset);
  };

  const handleSelectAllList = () => {
    const newAsset = assets.map((asset: any, idx: number) => {
      if (asset.order && (!!asset.order?.id || asset.order?.length > 0)) {
        if (isListing) {
          return { ...asset };
        } else {
          return {
            ...asset,
            isSelectedBulk: !isSelectedAll,
          };
        }
      } else {
        if (isListing) {
          return { ...asset, isSelectedBulk: !isSelectedAll };
        } else {
          return { ...asset };
        }
      }
    });
    setAssets(newAsset);
  };

  const onBulkHandle = async (price: string) => {
    const assetSelectAction = assets.filter((assetData: any) => {
      return assetData.isSelectedBulk === true;
    });
    if (assetSelectAction.length === 0) {
      if (isListing) {
        toast.warning("Please select asset to listing!");
      } else {
        toast.warning("Please select asset to unlisting!");
      }
      return;
    }
    setLoadingBulkHandle(true);
    try {
      if (isListing) {
        await bulkListErc721(
          client,
          account,
          starkKey,
          assetSelectAction,
          price,
          selectedToken.tokenType
        );
        toast.success("Listing success!");
      } else {
        await bulkUnListErc721(client, account, assetSelectAction);
        toast.success("UnListing success!");
      }
      await refetch();
      setLoadingBulkHandle(false);
    } catch (error) {
      console.log("Listing error: ", error);
      toast.error("Listing failed. Please check exception and try again !");
      setLoadingBulkHandle(false);
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
                <div className="col d-flex flex-col align-items-center">
                  <CurrencySelector
                    className={"col"}
                    options={optionsSelect}
                    selectHandle={selectListingOption}
                    defaultSelectedOption={optionsSelect.listing}
                  />
                </div>
                <div className="col d-flex align-items-end justify-content-center justify-content-md-end">
                  <button
                    disabled={loadingBulkHandle}
                    className={`btn-mry bg-warning fw-bold text-dark d-flex align-items-center justify-content-center ${style.btnListing}`}
                    onClick={() => onBulkHandle(price)}
                  >
                    {loadingBulkHandle ? (
                      <Loading />
                    ) : isListing ? (
                      "Bulk List NFTs"
                    ) : (
                      "Bulk Unlist NFTs"
                    )}
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
              <div className="row mt-4">
                <p className="d-flex justify-content-end col">
                  Selected: {numberSelect} / Total Ready{" "}
                  {isListing ? "Listing" : "Unlisting"}: {numberAvailableAssets}
                </p>
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
                    onButtonClick1={async () => onUnListing(asset)}
                    buttonTitle1="Unlisting"
                    onButtonClick2={async () => onList(asset.id, price)}
                    buttonTitle2="List NFT"
                    title={asset.name}
                    footer={`${asset.id} | ${asset.publicId}`}
                    isSelected={asset.isSelectedBulk}
                    onSelectItem={onSelectItem}
                    disabled={asset.order?.length > 0 || (!!asset.order?.id)}
                    isListing={isListing}
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
