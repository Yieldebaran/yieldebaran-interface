import React, { useState } from 'react';
import Markets from 'src/Components/Markets/markets';
import PoolDialog from 'src/Components/Markets/MarketsDialogs/PoolDialog/PoolDialog';
import { useYieldebaranDataContext } from 'src/Types/appDataContext';
import { useUiContext } from 'src/Types/uiContext';

const Home: React.FC = () => {
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
    <>
      <Markets supplyMarketDialog={supplyMarketDialog} />
      {openSupplyMarketDialog ? (
        <PoolDialog closeSupplyMarketDialog={closeSupplyMarketDialog} />
      ) : null}
    </>
  );
};

export default Home;
