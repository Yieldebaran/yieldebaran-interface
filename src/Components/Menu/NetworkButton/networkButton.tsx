import React, { useEffect, useRef } from 'react';

import { ChainConfig } from 'src/constants/chain';
import { useSetModal } from 'src/providers/StoreProvider';

import { useGlobalContext } from 'src/Types/globalContext';
import { useUiContext } from 'src/Types/uiContext';

import Button from '../../Button/button';

const NetworkButton: React.FC = () => {
  const { setMobileMenuOpen } = useUiContext();
  const setModal = useSetModal();
  const { network } = useGlobalContext();
  const netWorkRef = useRef<ChainConfig | null>(null);
  netWorkRef.current = network;

  useEffect(() => {
    const temp = { ...network } as ChainConfig;
    if (temp) netWorkRef.current = temp;
  }, [network]);

  function handleChangeNetwork() {
    setMobileMenuOpen(false);
    setModal({ key: 'selectChain' });
  }

  return netWorkRef.current ? (
    <Button
      onClick={handleChangeNetwork}
      arrow={true}
      image={<img src={netWorkRef.current?.logo} alt="" />}
    >
      {netWorkRef.current?.network}
    </Button>
  ) : (
    <Button onClick={handleChangeNetwork} arrow={true}>
      <span className="network-name">Networks</span>
    </Button>
  );
};

export default NetworkButton;
