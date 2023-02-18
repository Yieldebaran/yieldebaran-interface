/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import NETWORKS from '../networks'
import { UnsupportedChainIdError } from '@web3-react/core'
import {  NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
import { WalletConnectConnector, UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { xDefiConnector, XDEFIWalletNotDefaultError, XDEFIWalletNotFoundError } from './xdefi-connector'
import { MetamaskConnector, MetamaskNotFounfError } from './metamask-connector'


export enum connectrorsEnum{
    Metamask,
    WalletConnect,
    Coinbase,
    xDefi
}

const Networks = Object.values(NETWORKS)
const supportedChains = [...Networks].map(n => n.chainId)
const RPC_URLS: any = {}
Networks.forEach((n) => {
   RPC_URLS[n.chainId]= n.publicRpc
})

let walletConnect = new WalletConnectConnector({
    rpc: RPC_URLS,
    chainId: 1,
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true
})

export const GetConnector = (c: any, chain?: number): any => {
    if (c === connectrorsEnum.WalletConnect) {
        if (chain)
            walletConnect = new WalletConnectConnector({
                rpc: RPC_URLS,
                chainId: chain,
                bridge: 'https://bridge.walletconnect.org',
                qrcode: true
            })
        return walletConnect
    }
    if (c === connectrorsEnum.Coinbase) {
        return new WalletLinkConnector({
            url: chain ? NETWORKS[chain].publicRpc : NETWORKS[250].publicRpc,
            appName: 'Yieldebaran app',
            supportedChainIds: supportedChains
        })
    }
    if (c === connectrorsEnum.xDefi)
        return new xDefiConnector({supportedChainIds: supportedChains})
    return new MetamaskConnector({supportedChainIds: supportedChains})
}

export const getErrorMessage = (error: Error | undefined) => {
    if (error instanceof NoEthereumProviderError) {
        return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
    } else if (error instanceof UnsupportedChainIdError) {
        return "You're connected to an unsupported network."
    } else if (
        error instanceof UserRejectedRequestErrorInjected ||
        error instanceof UserRejectedRequestErrorWalletConnect
    ) {
        return 'Please authorize this website to access your Ethereum account.'
    } else if (error instanceof MetamaskNotFounfError) {
        return 'Please install Metamask or make it as your default wallet and refresh the page.'
    } else if (error instanceof XDEFIWalletNotFoundError) {
        return "Please install xDEFI Wallet."
    } else if (error instanceof XDEFIWalletNotDefaultError) {
        return 'Please enable "Prioritise XDEFI" on your xDEFI Wallet and refresh the page.'
    } else if (error) {
        console.error(error)
        return 'An unknown error occurred. Check the console for more details.'
    }
}
