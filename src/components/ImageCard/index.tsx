import { EnvTypes, MyriaClient, TokenType } from "myria-core-sdk";
import { MYRIA_TOKEN_PROD, MYRIA_TOKEN_STAGING } from "../../utils/utils";
import { optionsAsset } from "../../views/MyriaAssets";
import style from "./style.module.css";
import { useState } from "react";
import Loading from "../Loading";

type Props = {
  item: any;
  client: MyriaClient;
  index: number;
  onButtonClick1: (item: any) => Promise<void>;
  onButtonClick2?: (item: any) => Promise<void>;
  buttonTitle1: string;
  buttonTitle2?: string;
  title: string;
  footer: string;
  isSelected: boolean;
  onSelectList: (index: number, statusCheck: boolean) => void;
  disabled: boolean;
};

const ImageCard = ({
  item,
  client,
  index,
  onButtonClick1,
  onButtonClick2,
  buttonTitle1,
  buttonTitle2,
  title,
  footer,
  isSelected,
  onSelectList,
  disabled,
}: Props) => {
  const [loadingButton1, setLoadingButton1] = useState(false);
  const [loadingButton2, setLoadingButton2] = useState(false);

  const handleChangeCheckbox = () => {
    onSelectList(index, !isSelected);
  };
  const myriaTokenAddress =
    client?.env === EnvTypes.PRODUCTION
      ? MYRIA_TOKEN_PROD.assetType
      : MYRIA_TOKEN_STAGING.assetType;
  const isMyriaToken =
    item?.order?.[0]?.assetIdBuy?.toLowerCase() ===
    myriaTokenAddress.toLowerCase();
  const urlMarketplace =
    (client?.env === EnvTypes.PRODUCTION
      ? `https://myria.com/marketplace/asset-detail/?id=`
      : `https://staging.nonprod-myria.com/marketplace/asset-detail/?id=`) +
    item?.id;
  const priceAsset = item?.order?.[0]?.nonQuantizedAmountBuy || "";
  return (
    <div className="position-relative">
      {loadingButton1 || loadingButton2 ? (
        <Loading
          color="#FFC107"
          loadingSize={32}
          className="position-absolute top-50 start-50 translate-middle"
        />
      ) : null}
      <div
        className={`card mry-card position-relative h-100`}
        key={item.id}
        style={{
          opacity: disabled || loadingButton1 || loadingButton2 ? "0.5" : 1,
        }}
      >
        <input
          onChange={handleChangeCheckbox}
          className={`${
            disabled ? "pe-none" : ""
          } form-check-input position-absolute`}
          type="checkbox"
          checked={isSelected}
          id="flexCheckDefault"
        />
        <img
          src={item.imageUrl ? item.imageUrl : "/null.png"}
          alt={item.name}
          className="card-img-top img-thumbnail"
        />
        <div className="card-body position-relative pb-5 d-flex flex-column justify-content-between">
          <div className="">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{item.description}</p>
          </div>
          <div className="mt-4">
            {/* <p
              className={`card-link ${
                disabled || loadingButton1 ? "pe-none" : ""
              }`}
              onClick={async () => {
                setLoadingButton1(true);
                try {
                  onButtonClick1(item);
                  setLoadingButton1(false);
                } catch (error) {
                  setLoadingButton1(false);
                }
              }}
            >
              {buttonTitle1}
            </p> */}
            {onButtonClick2 && buttonTitle2 ? (
              <p
                className={`ms-0 card-link ${
                  disabled || loadingButton2 ? "pe-none" : ""
                }`}
                onClick={async () => {
                  setLoadingButton2(true);
                  try {
                    await onButtonClick2(item.id);
                    setLoadingButton2(false);
                  } catch (error) {
                    setLoadingButton2(false);
                  }
                }}
              >
                {buttonTitle2}
              </p>
            ) : null}
          </div>
          {disabled ? (
            <div
              className={`position-absolute d-flex align-items-center flex-col ${style.containerPrice}`}
            >
              {
                <>
                  <p className="mb-0 me-2">{priceAsset}</p>
                  <img
                    className={style.imgAssetIcon}
                    src={
                      isMyriaToken
                        ? optionsAsset[TokenType.ERC20].ico
                        : optionsAsset[TokenType.ETH].ico
                    }
                    alt="icon-asset"
                  />
                </>
              }
            </div>
          ) : null}
        </div>
        <div className="card-footer">
          <a
            href={urlMarketplace}
            rel="noreferrer"
            target="_blank"
            className="text-decoration-none"
          >
            <small className="text-muted">{footer}</small>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
