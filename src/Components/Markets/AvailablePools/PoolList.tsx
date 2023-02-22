import React, { useEffect } from 'react';

import '../style.css';
import ReactTooltip from 'react-tooltip';

import { useYieldebaranDataContext } from '../../../Types/appDataContext';

import PoolRow from './PoolRow';
import 'tippy.js/dist/tippy.css';

interface Props {
  supplyMarketDialog: (selectedPool: string) => void;
}

const PoolList: React.FC<Props> = (props: Props) => {
  const { eapStates } = useYieldebaranDataContext();

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
