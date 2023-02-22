import Tippy from '@tippyjs/react';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import 'tippy.js/dist/tippy.css'; // optional
import { useYieldebaranDataContext } from '../../../Types/appDataContext';

import { useUiContext } from '../../../Types/uiContext';
import { formatBN } from '../../../Utils/numbers';

import '../style.css';

interface Props {
  pool: string;
  supplyMarketDialog: (selectedPool: string) => void;
}

const PoolRow: React.FC<Props> = (props: Props) => {
  const { accountEthBalance, eapStates } = useYieldebaranDataContext();
  const { setShowWallets } = useUiContext();
  const { account } = useWeb3React<providers.Web3Provider>();
  const navigate = useNavigate();

  const eap = eapStates[props.pool];

  const handleOpenSupplyMarketDialog = () => {
    console.log(props);
    navigate(`/pools/${props.pool}`);
    return;
    console.log('skfjakf', account);
    if (!account) {
      setShowWallets(true);
      return;
    }
    if (props.pool) {
      props.supplyMarketDialog(props.pool);
    }
  };

  const balance = formatBN(
    eap.accountUnderlyingBalance.native + (eap.isEth ? accountEthBalance.native : 0n),
    18,
  );
  const balanceUsd =
    Math.round(
      eap.underlyingUsdPrice *
        Number(
          Number(eap.accountUnderlyingBalance.formatted) +
            Number(eap.isEth ? accountEthBalance.formatted : 0) * 100,
        ),
    ) / 100;

  return (
    <tr>
      <td onClick={handleOpenSupplyMarketDialog}>
        <div className="asset">
          <div className="asset-logo">
            <img className="rounded-circle" src={eap.underlyingLogo} alt="" />
          </div>
          <span>{eap.underlyingSymbol}</span>
        </div>
      </td>
      <td className="apy positive" onClick={handleOpenSupplyMarketDialog}>
        <div className="supply-apy">
          <Tippy content={`Based on onchain data for the last ${eap.apyAfterFee[0].period}s`}>
            <div className="apy-content">{Number(eap.apyAfterFee[0].apy).toFixed(2)}%</div>
          </Tippy>
        </div>
      </td>
      <td onClick={handleOpenSupplyMarketDialog}>
        {
          <Tippy content={`~$${eap.TVL_USD}`}>
            <div>{Number(eap.totalUnderlyingBalance.formatted).toFixed(3)}</div>
          </Tippy>
        }
      </td>
      <td onClick={handleOpenSupplyMarketDialog}>
        {
          <Tippy content={`~$${eap.accountAllocatedUSD}`}>
            <div>{Number(eap.accountAllocated.formatted).toFixed(3)}</div>
          </Tippy>
        }
      </td>
      <td onClick={handleOpenSupplyMarketDialog}>
        {
          <Tippy content={`~$${balanceUsd}`}>
            <div>{Number(balance).toFixed(3)}</div>
          </Tippy>
        }
      </td>
    </tr>
  );
};

export default PoolRow;
