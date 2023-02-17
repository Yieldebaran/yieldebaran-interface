import Logos from "./logos"

type Network = {
    chainId: number,
    network: string,
    logo: string,
    blocksPerYear?: number,
    publicRpc: string,
    explorerUrl: string,
    weth: string,
    eaps: string[],
    usdc: string,
    timestampContract: string,
    blockNumberContract: string,
    networkProperties: {
        chainId: string | number,
        chainName: string,
        nativeCurrency:
            {
                name: string,
                symbol: string,
                decimals: number
            },
        rpcUrls: string[],
        blockExplorerUrls: string[],
    }
}

type NetworkData = {
    [chainId: number]: Network
}

const NETWORKS: NetworkData = {
    250: {
        chainId: 250,
        network: "Fantom Opera",
        logo: Logos["FTM"],
        blocksPerYear: 24 * 60 * 60 * 365,
        publicRpc: "https://rpc.ftm.tools/",
        explorerUrl: "https://ftmscan.com",
        weth: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
        eaps: ["0xCD0f76597A0aeB12685936B73eca2D8C744c255F"],
        usdc: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
        timestampContract: "0x6e11aaD63d11234024eFB6f7Be345d1d5b8a8f38",
        blockNumberContract: "0x37517C5D880c5c282437a3Da4d627B4457C10BEB",
        networkProperties: {
            chainId: 250,
            chainName: 'Fantom',
            nativeCurrency:
                {
                    name: 'FTM',
                    symbol: 'FTM',
                    decimals: 18
                },
            rpcUrls: ["https://rpc.ftm.tools/"],
            blockExplorerUrls: ["https://ftmscan.com"],
        },
    },
}

export default NETWORKS
export type { Network }
