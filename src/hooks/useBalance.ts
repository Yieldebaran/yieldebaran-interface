import {useEffect, useState} from 'react';
import { BigNumber, ethers } from 'ethers';
import {useGlobalContext} from "../Types/globalContext";
import {useHundredDataContext} from "../Types/appDataContext";

import erc20Abi from '../abi/erc20.json';
import {isAddressesEq} from "../Utils/compareAddresses";

export const useBalance = (tokenAddress: string | null, ownerAddress: string | null) => {
  const {network} = useGlobalContext();
  const {appState} = useHundredDataContext();
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    if (!ownerAddress || !tokenAddress) return;
    if (!appState.provider) return;
    if (!network) return;

    const contract = new ethers.Contract(tokenAddress, erc20Abi, appState.provider);

    const fetchAndSetBalance = () => {
      if (!contract) {
        setBalance('0');
        return;
      }
      console.log('fetch balance', { tokenAddress, ownerAddress });
      contract?.balanceOf(ownerAddress).then((resp: BigNumber) => {
        console.log('balance: ', { tokenAddress, ownerAddress, balance: resp.toString() });
        setBalance(resp.toString());
      });
    };

    function transferEventHandler(from: string, to: string) {
      if (!ownerAddress) return;
      if (isAddressesEq(from, ownerAddress) || isAddressesEq(to, ownerAddress))
        fetchAndSetBalance();
    }

    function depositOrWithdrawalHandler(address: string) {
      if (!ownerAddress) return;
      if (isAddressesEq(address, ownerAddress)) fetchAndSetBalance();
    }

    const trackTokenTransfer = () => {
      if (!contract || !tokenAddress) return;
      console.log('trackTokenTransfer fired');
      contract.on('Transfer', transferEventHandler);
      if (isAddressesEq(tokenAddress, network.weth)) {
        contract?.on('Deposit', depositOrWithdrawalHandler);
        contract?.on('Withdrawal', depositOrWithdrawalHandler);
      }
    };

    const clearTokenTransferTracking = () => {
      console.log('trackTokenTransfer remove listener');
      contract?.removeListener('Transfer', transferEventHandler);
      contract?.removeListener('Deposit', depositOrWithdrawalHandler);
      contract?.removeListener('Withdrawal', depositOrWithdrawalHandler);
    };

    fetchAndSetBalance();
    trackTokenTransfer();

    return () => {
      console.log('clearTokenTransferTracking fired');
      clearTokenTransferTracking();
    };
  }, [ownerAddress, tokenAddress, appState]);

  return balance;
};
