import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHAIN_LIST, ChainId } from 'src/constants/chain';
import { toHex } from 'src/helpers';
import { useChain } from 'src/providers/ChainProvider';
import styled from 'styled-components';

import { Button } from '../../Button/button';

const MenuContainer = styled.div`
  position: relative;
  margin-right: 1rem;
`;

const Menu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% - 2px);
  display: flex;
  flex-direction: column;
  border: 2px solid #fff;
  min-width: 100%;
  padding: 0.5rem 1.2rem 0.3rem;
  text-align: right;
`;

const MenuItem = styled.div`
  cursor: pointer;
  padding: 0.4rem 0 0.2rem;
  white-space: nowrap;
`;

export const NetworkSelector: React.FC = () => {
  const navigate = useNavigate();
  const { connector, library } = useWeb3React();
  const [showMenu, setShowMenu] = useState(false);
  const { chainConfig } = useChain();
  const chainsIds = Object.keys(CHAIN_LIST) as unknown as ChainId[];

  useEffect(() => {
    document.addEventListener('click', documentClickHandler);
  }, []);

  function documentClickHandler() {
    setShowMenu(false);
  }

  async function switchNetwork(chain: ChainId) {
    navigate(`/${chain}`);
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
        setShowMenu(false);
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
            setShowMenu(false);
          } catch (error) {
            console.error('Error', error);
          }
        }
      }
    } else {
      setShowMenu(false);
    }
  }

  return (
    <MenuContainer
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.preventDefault();
      }}
    >
      {chainConfig && (
        <Button arrow={chainsIds.length > 1} onClick={() => setShowMenu(!showMenu)}>
          {chainConfig.networkName}
        </Button>
      )}
      {chainsIds.length > 1 && showMenu && (
        <Menu>
          {chainsIds.map((chainId: ChainId) => (
            <MenuItem key={chainId} onClick={() => switchNetwork(CHAIN_LIST[chainId].chainId)}>
              {CHAIN_LIST[chainId].networkName}
            </MenuItem>
          ))}
        </Menu>
      )}
    </MenuContainer>
  );
};
