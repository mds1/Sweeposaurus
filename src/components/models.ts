import { ethers } from 'ethers';
import { TokenInfo } from '@uniswap/token-lists';

export type Signer = ethers.providers.JsonRpcSigner;
export type Provider = ethers.providers.Web3Provider;
export type BigNumber = ethers.BigNumber;
export type BigNumberish = ethers.BigNumberish;
export type BytesLike = ethers.BytesLike;
export type TransactionRequest = ethers.providers.TransactionRequest;
export type TransactionResponse = ethers.providers.TransactionResponse;

export interface TokenDetails extends TokenInfo {
  balance: ethers.BigNumber;
  amountToSend?: number | string | undefined;
}

export interface MulticallResponse {
  blockNumber: ethers.BigNumber;
  returnData: string[];
}

export interface Window {
  goatcounter: {
    count: (vars: { path: string; event: boolean }) => void;
  };
}
