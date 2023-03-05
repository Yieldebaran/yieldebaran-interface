import { useWeb3React } from '@web3-react/core';
import React from 'react';
import Modal from 'src/components/Modal/modal';

import 'src/components/modals/SelectChainModal.css';
import { CHAIN_LIST, ChainId } from 'src/constants/chain';
import { toHex } from 'src/helpers';
import { useChain } from 'src/providers/ChainProvider';
import { useSetModal } from 'src/providers/StoreProvider';

export const SelectChainModal: React.FC = () => {
  const { setSelectedChainId } = useChain();
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
            console.error('Error', error);
          }
        }
      }
    } else {
      setSelectedChainId(chain);
      handleClose();
    }
  }

  return (
    <>
      <Modal open={true} onClose={handleClose} title="Select network">
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
