import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { useContractsData } from 'src/providers/ContractsDataProvider';
import 'tippy.js/dist/tippy.css';

import '../style.css';

import PoolRow from './PoolRow';

interface Props {
  supplyMarketDialog: (selectedPool: string) => void;
}

const PoolList: React.FC<Props> = (props: Props) => {
  const { eapStates } = useContractsData();

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div className="market-content">
      <table className="market-table">
        <thead className="market-table-header">
          <tr>
            <th colSpan={5}>
              <div className="seperator" />
            </th>
          </tr>
          <tr className="market-table-header-headers">
            <th className="market-header-title">Asset</th>
            <th className="market-header-title">APY</th>

            <th className="market-header-title">Total assets</th>
            <th className="market-header-title">Your deposit</th>
            <th className="market-header-title">On wallet</th>
          </tr>
          <tr>
            <th colSpan={5}>
              <div className="seperator" />
            </th>
          </tr>
        </thead>
        {
          <tbody className="market-table-content">
            {Object.keys(eapStates).length === 0
              ? null
              : Object.keys(eapStates).map((pool, index) => {
                  return (
                    <PoolRow
                      key={index}
                      pool={pool}
                      supplyMarketDialog={props.supplyMarketDialog}
                    />
                  );
                })}
          </tbody>
        }
      </table>
    </div>
  );
};

export default PoolList;
