import { toHex } from 'src/helpers';
import Logos from 'src/logos';

export const DEFAULT_CHAIN = 250;

export enum ChainId {
  FTM = 250,
  CANTO = 7700,
}

export type ChainConfig = {
  chainId: ChainId;
  networkName: string;
  logo: string;
  publicRpc: string;
  publicWebSocket: string;
  explorerUrl: string;
  weth: string;
  ethAdapter: string;
  eaps: string[];
  usdc: string;
  timestampContract: string;
  blockNumberContract: string;
  etherscanApiUrl: string;
  etherscanApiKey?: string;
  brokenEthCall?: boolean;
  inception: number;
  adapters: { [address: string]: string };
  liquiditySource: { codeHash: string, factory: string, isSolidly: boolean };
  networkProperties: {
    chainId: string;
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
  };
};

const BASE_CHAIN_LIST: Record<ChainId, ChainConfig> = {
  [ChainId.FTM]: {
    chainId: ChainId.FTM,
    networkName: 'Fantom Opera',
    logo: Logos['FTM'],
    publicRpc: 'https://rpc.ftm.tools/',
    publicWebSocket: 'wss://wsapi.fantom.network/',
    explorerUrl: 'https://ftmscan.com',
    etherscanApiUrl: 'https://api.ftmscan.com/api',
    etherscanApiKey: '2G6J2JBPRTFVQQRIIQ4BXNZD17AIH1CJMK',
    weth: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    eaps: ['0x4dA549Be5164a4Afd95F426e48A4f0D320Fe057e'],
    usdc: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    adapters: {
      '0xd56C2CbA8479442f9576897B99b74527626Da409': 'Tarot',
    },
    liquiditySource: {
      codeHash: '0xcdf2deca40a0bd56de8e3ce5c7df6727e5b1bf2ac96f283fa9c4b3e6b42ea9d2',
      factory: '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3',
      isSolidly: false,
    },
    ethAdapter: '0x467EF73129964e8d3C4A638A084Ff33953cA0783',
    inception: 56108871,
    timestampContract: '0x6e11aaD63d11234024eFB6f7Be345d1d5b8a8f38',
    blockNumberContract: '0x37517C5D880c5c282437a3Da4d627B4457C10BEB',
    networkProperties: {
      chainId: toHex(ChainId.FTM),
      chainName: 'Fantom',
      nativeCurrency: {
        name: 'FTM',
        symbol: 'FTM',
        decimals: 18,
      },
      rpcUrls: ['https://rpc.ftm.tools/'],
      blockExplorerUrls: ['https://ftmscan.com'],
    },
  },
  [ChainId.CANTO]: {
    chainId: ChainId.CANTO,
    networkName: 'Canto',
    logo: Logos['CANTO'],
    publicRpc: 'https://rpc.cantoarchive.com',
    brokenEthCall: true,
    publicWebSocket: 'wss://canto.gravitychain.io:8546',
    explorerUrl: 'https://tuber.build',
    etherscanApiUrl: 'https://evm.explorer.canto.io/api',
    weth: '0x826551890Dc65655a0Aceca109aB11AbDbD7a07B',
    eaps: ['0xC690A3fFC47257be10Ac50F3b96826896C316E37'],
    usdc: '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd',
    liquiditySource: {
      codeHash: '0xccd05873bc36fc9d38cc3a46781ecfa3bcbc4bad8dc816795dd897c5313ccdee',
      factory: '0xF80909DF0A01ff18e4D37BF682E40519B21Def46',
      isSolidly: true,
    },
    adapters: {
      '0x178c6869122EFFF3F147905A5c39F24D0918f084': 'Tarot',
    },
    ethAdapter: '0x730DaB8924aB7F892a28d8B740daaFA00d22ACe6',
    inception: 4054905,
    timestampContract: '0x6C7aD215aB27B19e51443bc598fcEAcab5067bfC',
    blockNumberContract: '0x6C7aD215aB27B19e51443bc598fcEAcab5067bfC',
    networkProperties: {
      chainId: toHex(ChainId.CANTO),
      chainName: 'Canto',
      nativeCurrency: {
        name: 'Canto',
        symbol: 'CANTO',
        decimals: 18,
      },
      rpcUrls: ['https://canto.dexvaults.com/'],
      blockExplorerUrls: ['https://tuber.build'],
    },
  },
};

export const CHAIN_LIST = Object.freeze(BASE_CHAIN_LIST);
