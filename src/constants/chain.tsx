import Logos from 'src/logos';

export const DEFAULT_CHAIN = 250;

export enum ChainId {
  FTM = 250,
}

export type ChainConfig = {
  chainId: ChainId;
  network: string;
  logo: string;
  blocksPerYear?: number;
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
  etherscanApiKey: string;
  inception: number;
  adapters: { [address: string]: string };
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
    network: 'Fantom Opera',
    logo: Logos['FTM'],
    blocksPerYear: 24 * 60 * 60 * 365,
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
    ethAdapter: '0x467EF73129964e8d3C4A638A084Ff33953cA0783',
    inception: 56108871,
    timestampContract: '0x6e11aaD63d11234024eFB6f7Be345d1d5b8a8f38',
    blockNumberContract: '0x37517C5D880c5c282437a3Da4d627B4457C10BEB',
    networkProperties: {
      chainId: '0xfa',
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
};

export const CHAIN_LIST = Object.freeze(BASE_CHAIN_LIST);
