import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React from 'react';
import Modal from 'src/Components/Modal/modal';
import { CHAIN_LIST, ChainId } from 'src/constants/chain';
import { toHex } from 'src/helpers';
import { useSetModal } from 'src/providers/StoreProvider';
import { useGlobalContext } from 'src/Types/globalContext';

import './networksMenu.css';

export const SelectChainModal: React.FC = () => {
  const { setNetwork, setWebSocketProvider } = useGlobalContext();
  const { connector, library } = useWeb3React();
  const setModal = useSetModal();

  function handleClose() {
    setModal(null);
  }

  async function switchNetwork(chain: ChainId) {
    if (connector) {
      try {
        if (library)
          await library.provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: toHex(chain) }],
          });
        else {
          const prov = await connector.getProvider();
          if (prov)
            await prov.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: toHex(chain) }],
            });
        }
        handleClose();
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            if (library)
              await library.provider.request({
                method: 'wallet_addEthereumChain',
                params: [CHAIN_LIST[chain].networkProperties],
              });
            else {
              const prov = await connector.getProvider();
              await prov.request({
                method: 'wallet_addEthereumChain',
                params: [CHAIN_LIST[chain].networkProperties],
              });
            }
            handleClose();
          } catch (error) {
            console.log('Error', error);
          }
        }
      }
    } else {
      setNetwork(CHAIN_LIST[chain]);
      setWebSocketProvider(
        new ethers.providers.WebSocketProvider(CHAIN_LIST[chain].publicWebSocket),
      );
      handleClose();
    }
  }

  return (
    <>
      <Modal open={true} close={handleClose} title="Select network">
        <div className="networks-view">
          {Object.values(CHAIN_LIST).map((value, index) => {
            let disabled = false;
            if (connector?.supportedChainIds) {
              disabled = !connector.supportedChainIds.includes(value.chainId);
            }

            return (
              <div
                className={`network-item ${disabled ? 'network-item-disabled' : ''}`}
                key={index}
                onClick={() => (disabled ? null : switchNetwork(value.chainId))}
              >
                <div className="network-logo">
                  <img src={value.logo} alt="" />
                </div>
                <span>{value.network}</span>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};
