import React, { useEffect, useRef } from 'react';

import { ChainConfig } from 'src/constants/chain';
import { useAppearance } from 'src/providers/AppearanceProvider';
import { useChain } from 'src/providers/ChainProvider';
import { useSetModal } from 'src/providers/StoreProvider';

import Button from '../../Button/button';

const NetworkButton: React.FC = () => {
  const { setMobileMenuOpen } = useAppearance();
  const setModal = useSetModal();
  const { chainConfig } = useChain();
  const netWorkRef = useRef<ChainConfig | null>(null);
  netWorkRef.current = chainConfig;

  useEffect(() => {
    const temp = { ...chainConfig } as ChainConfig;
    if (temp) netWorkRef.current = temp;
  }, [chainConfig]);

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
