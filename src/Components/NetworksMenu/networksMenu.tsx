import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import React from 'react';
import { ethers } from 'ethers';

import { toHex } from 'src/helpers';
import NETWORKS from 'src/networks';
import { useGlobalContext } from 'src/Types/globalContext';

import { useUiContext } from 'src/Types/uiContext';

import Modal from '../Modal/modal';
import './networksMenu.css';

const NetworkConnect: React.FC = () => {
  const { connector, library } = useWeb3React();
  const { setNetwork, setWebSocketProvider } = useGlobalContext();

  const { openNetwork, setOpenNetwork, setSwitchModal } = useUiContext();

  const switchNetwork = async (chain: number) => {
    if (connector instanceof WalletConnectConnector) {
      setSwitchModal(true);
    }
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
        setSwitchModal(false);
        setOpenNetwork(false);
      } catch (switchError: any) {
        console.log(switchError);
        if (switchError.code === 4902) {
          try {
            if (library)
              await library.provider.request({
                method: 'wallet_addEthereumChain',
                params: [NETWORKS[chain].networkProperties],
              });
            else {
              const prov = await connector.getProvider();
              await prov.request({
                method: 'wallet_addEthereumChain',
                params: [NETWORKS[chain].networkProperties],
              });
            }
            setSwitchModal(false);
            setOpenNetwork(false);
          } catch (error) {
            console.log('Error', error);
          }
        }
      }
    } else {
      setNetwork(NETWORKS[chain]);
      setWebSocketProvider(new ethers.providers.WebSocketProvider(NETWORKS[chain].publicWebSocket));
      setSwitchModal(false);
      setOpenNetwork(false);
    }
  };

  return (
    <>
      <Modal open={openNetwork} close={() => setOpenNetwork(false)} title="Select network">
        <div className="networks-view">
          {Object.values(NETWORKS).map((value, index) => {
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

export default NetworkConnect;
