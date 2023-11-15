import { TokenType } from "myria-core-sdk";

export interface TOption {
    id: number;
    name: string;
    short: string;
    ico: string;
    // tokenAddress: string;
    // assetType?: string;
    tokenType?: TokenType;
    iconComponent?: (props: string) => JSX.Element;
  }
  
  export interface IOptionsAsset {
    [code: string]: TOption;
  }

  export const MYRIA_TOKEN_STAGING = {
    // tokenAddress: '0xa0ef786bf476fe0810408caba05e536ac800ff86',
    // assetType: '0x79ee7d871797a521c7a0cd953e51a1f079ff3d3a0b02a4d63f995258fcf0ef',
    // tokenAddress: '0xA06116D9E28AF403d6989c45EF8C0b9B971e5E12',
    // assetType:
    //   '0x17537cd2e5d66302aec28ed4a72b0c1e05a3d4ec26dcf23f220c98a53905d75',
    tokenAddress: '0x83a795E1E91560Aae4207fDae9199d384f11D9d2',
    assetType:
      '0x35a3bcb15fdc5f90b543bf3609e0ee6d16a09e3b8044801bb65475aabc28f7b',
  };
  export const MYRIA_TOKEN_PROD = {
    tokenAddress: '0xa0ef786bf476fe0810408caba05e536ac800ff86',
    assetType: '0x79ee7d871797a521c7a0cd953e51a1f079ff3d3a0b02a4d63f995258fcf0ef',
    // tokenAddress: '0xA06116D9E28AF403d6989c45EF8C0b9B971e5E12',
    // assetType:
    //   '0x17537cd2e5d66302aec28ed4a72b0c1e05a3d4ec26dcf23f220c98a53905d75',
  };

  export const ETH_TOKEN = {
    assetType: '0xb333e3142fe16b78628f19bb15afddaef437e72d6d7f5c6c20c6801a27fba6',
  };
  