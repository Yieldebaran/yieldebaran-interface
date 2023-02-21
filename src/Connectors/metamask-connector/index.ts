/* eslint-disable @typescript-eslint/no-unused-vars */
import { AbstractConnector } from '@web3-react/abstract-connector'
import warning from 'tiny-warning'

import { SendReturnResult, SendReturn, Send, SendOld } from './types'

function parseSendReturn(sendReturn: SendReturnResult | SendReturn): any {
  return sendReturn.hasOwnProperty('result') ? sendReturn.result : sendReturn
}

export class NoEthereumProviderError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'No Ethereum provider was found on window.ethereum.'
  }
}

export class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

export class MetamaskNotFounfError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'Metamask not found or not default.'
  }
}

export class MetamaskConnector extends AbstractConnector {

  private setOpenNetwork: (flag: boolean) => void
  private chainIdSelected: number | null

  constructor(kwargs: any, setOpenNetwork: (flag: boolean) => void) {
    super(kwargs)

    this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleConnect = this.handleConnect.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.setOpenNetwork = setOpenNetwork
    this.chainIdSelected = null
  }

  private handleChainChanged(chainId: string | number): void {

    if (this.chainIdSelected && !this.supportedChainIds?.includes(Number(chainId))) {
      // console.log('handleChainChanged, unsupported chain')
      this.setOpenNetwork(true)
    }
    this.chainIdSelected = Number(chainId)
    // if (__DEV__) {
    //   console.log("Handling 'chainChanged' event with payload", chainId)
    // }
    this.emitUpdate({ chainId, provider: window.ethereum })
  }

  private handleAccountsChanged(accounts: string[]): void {
    // if (__DEV__) {
    //   console.log("Handling 'accountsChanged' event with payload", accounts)
    // }
    if (accounts.length === 0) {
      this.emitDeactivate()
    } else {
      this.emitUpdate({ account: accounts[0] })
    }
  }

  private handleClose(_code: number, _reason: string): void {
    // if (__DEV__) {
    //   console.log("Handling 'close' event with payload", code, reason)
    // }
    this.emitDeactivate()
  }

  private handleNetworkChanged(networkId: string | number): void {
    // if (__DEV__) {
    //   console.log("Handling 'networkChanged' event with payload", networkId)
    // }
    this.emitUpdate({ chainId: networkId, provider: window.ethereum })
  }

  private handleConnect(data: any): void {
    // if (__DEV__) {
    //   console.log("Handling 'networkChanged' event with payload", networkId)
    // }
    // console.log(this.supportedChainIds)
    // console.log('on connect', data)

    if (this.chainIdSelected && !this.supportedChainIds?.includes(Number(data.chainId))) {
      // console.log('handleConnect, unsupported chain')
      this.setOpenNetwork(true)
    }

    this.chainIdSelected = Number(data.chainId)

    this.emitUpdate({ chainId: data.chainId, provider: window.ethereum })
  }

  public async activate(): Promise<any> {
    if (!window.ethereum) {
      throw new NoEthereumProviderError()
    }

    if(window.ethereum && window.ethereum.__XDEFI){
      throw new MetamaskNotFounfError()
    }

    if (window.ethereum.on) {
      window.ethereum.on('chainChanged', this.handleChainChanged)
      window.ethereum.on('accountsChanged', this.handleAccountsChanged)
      window.ethereum.on('close', this.handleClose)
      window.ethereum.on('networkChanged', this.handleNetworkChanged)
      window.ethereum.on('connect', this.handleConnect)
    }

    if ((window.ethereum as any).isMetaMask) {
      (window.ethereum as any).autoRefreshOnNetworkChange = false
    }

    // try to activate + get account via eth_requestAccounts
    let account
    try {
      const accounts = await (window.ethereum.send as Send)('eth_requestAccounts')
      account = parseSendReturn(accounts)[0]
    } catch (error) {
      if ((error as any).code === 4001) {
        throw new UserRejectedRequestError()
      }
      warning(false, 'eth_requestAccounts was unsuccessful, falling back to enable')
    }

    // if unsuccessful, try enable
    if (!account) {
      // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
      account = parseSendReturn(await window.ethereum.enable())[0]
    }

    if (this.chainIdSelected && !this.supportedChainIds?.includes(Number(this.chainIdSelected))) {
      // console.log('activate, unsupported chain')
      this.setOpenNetwork(true)
    }

    return { provider: window.ethereum, ...(account ? { account } : {}) }
  }

  public async getProvider(): Promise<any> {
    return window.ethereum
  }

  public async getChainId(): Promise<number | string> {
    if (!window.ethereum) {
      throw new NoEthereumProviderError()
    }

    let chainId
    try {
      chainId = await (window.ethereum.send as Send)('eth_chainId').then(parseSendReturn)
    } catch {
      warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
    }

    if (!chainId) {
      try {
        chainId = await (window.ethereum.send as Send)('net_version').then(parseSendReturn)
      } catch {
        warning(false, 'net_version was unsuccessful, falling back to net version v2')
      }
    }

    if (!chainId) {
      try {
        chainId = parseSendReturn((window.ethereum.send as SendOld)({ method: 'net_version' }))
      } catch {
        warning(false, 'net_version v2 was unsuccessful, falling back to manual matches and static properties')
      }
    }

    if (!chainId) {
      if ((window.ethereum as any).isDapper) {
        chainId = parseSendReturn((window.ethereum as any).cachedResults.net_version)
      } else {
        chainId =
          (window.ethereum as any).chainId ||
          (window.ethereum as any).netVersion ||
          (window.ethereum as any).networkVersion ||
          (window.ethereum as any)._chainId
      }
    }

    return chainId
  }

  public async getAccount(): Promise<null | string> {
    if (!window.ethereum) {
      throw new NoEthereumProviderError()
    }

    let account
    try {
      account = await (window.ethereum.send as Send)('eth_accounts').then(sendReturn => parseSendReturn(sendReturn)[0])
    } catch {
      warning(false, 'eth_accounts was unsuccessful, falling back to enable')
    }

    if (!account) {
      try {
        account = await window.ethereum.enable().then((sendReturn: any) => parseSendReturn(sendReturn)[0])
      } catch {
        warning(false, 'enable was unsuccessful, falling back to eth_accounts v2')
      }
    }

    if (!account) {
      account = parseSendReturn((window.ethereum.send as SendOld)({ method: 'eth_accounts' }))[0]
    }

    return account
  }

  public deactivate() {
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('chainChanged', this.handleChainChanged)
      window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged)
      window.ethereum.removeListener('close', this.handleClose)
      window.ethereum.removeListener('connect', this.handleClose)
      window.ethereum.removeListener('networkChanged', this.handleNetworkChanged)
    }
  }

  public async isAuthorized(): Promise<boolean> {
    if (!window.ethereum) {
      return false
    }

    try {
      return await (window.ethereum.send as Send)('eth_accounts').then(sendReturn => {
        return parseSendReturn(sendReturn).length > 0;
      })
    } catch {
      return false
    }
  }
}
