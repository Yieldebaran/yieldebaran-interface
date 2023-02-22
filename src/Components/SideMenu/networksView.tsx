import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { ethers } from 'ethers';
import React from 'react';
import { CHAIN_LIST, ChainId } from 'src/constants/chain';

import { toHex } from '../../helpers';
import { useGlobalContext } from '../../Types/globalContext';
import { useUiContext } from '../../Types/uiContext';
import Modal from '../Modal/modal';

import './networksView.css';

const NetworksView: React.FC = () => {
  const { connector, library } = useWeb3React();
  const { network, setNetwork, setWebSocketProvider } = useGlobalContext();

  const { setOpenNetwork, setSwitchModal, switchModal } = useUiContext();

  const switchNetwork = async (chain: ChainId) => {
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
                params: [CHAIN_LIST[chain].networkProperties],
              });
            else {
              const prov = await connector.getProvider();
              await prov.request({
                method: 'wallet_addEthereumChain',
                params: [CHAIN_LIST[chain].networkProperties],
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
      setNetwork(CHAIN_LIST[chain]);
      setWebSocketProvider(
        new ethers.providers.WebSocketProvider(CHAIN_LIST[chain].publicWebSocket),
      );
    }
  };

  return (
    <>
      <div className="networks-view">
        <div className="networks-caption">Networks</div>
        {Object.values(CHAIN_LIST).map((value, index) => {
          let disabled = false;
          if (connector?.supportedChainIds)
            disabled = !connector.supportedChainIds.includes(value.chainId);

          return (
            <div
              className={`network-item ${
                value.chainId === network?.chainId ? 'network-selected' : ''
              } ${disabled ? 'network-item-disabled' : ''}`}
              key={index}
              onClick={() =>
                value.chainId === network?.chainId || disabled ? null : switchNetwork(value.chainId)
              }
            >
              <img src={value.logo} className="network-logo" alt="" />
              <span>{value.network}</span>
            </div>
          );
        })}
      </div>
      <Modal open={switchModal} close={() => setSwitchModal(false)} title="Switch Network">
        <div className="modal-error">
          <div className="modal-error-message">
            <p>Please switch from your wallet.</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NetworksView;
