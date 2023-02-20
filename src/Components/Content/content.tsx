import React, { useState } from 'react';

import { useYieldebaranDataContext } from '../../Types/appDataContext';
import { useUiContext } from '../../Types/uiContext';

import Markets from '../Markets/markets';
import InteractionDialog from '../Markets/MarketsDialogs/PoolDialog/PoolDialog';

const Content: React.FC = () => {
  const { spinnerVisible } = useUiContext();
  const { setSelectedPool } = useYieldebaranDataContext();

  const [openSupplyMarketDialog, setOpenSupplyDialog] = useState(false);

  const supplyMarketDialog = (pool: string) => {
    setSelectedPool(pool);
    setOpenSupplyDialog(true);
  };

  const closeSupplyMarketDialog = () => {
    if (!spinnerVisible) {
      setOpenSupplyDialog(false);
    }
  };

  // render main logic frame
  return (
    <div className="content">
      <Markets supplyMarketDialog={supplyMarketDialog} />
      {openSupplyMarketDialog ? (
        <InteractionDialog closeSupplyMarketDialog={closeSupplyMarketDialog} />
      ) : null}
    </div>
  );
};

export default Content;
