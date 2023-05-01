import Tippy from '@tippyjs/react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import 'src/components/PoolsList/style.css';
import { useContractsData } from 'src/providers/ContractsDataProvider';
import { formatBN } from 'src/utils/numbers';
import 'tippy.js/dist/tippy.css';

interface Props {
  pool: string;
}

const PoolRow: React.FC<Props> = (props: Props) => {
  const { accountEthBalance, eapStates } = useContractsData();
  const { chainId } = useParams();
  const navigate = useNavigate();

  const eap = eapStates[props.pool];

  const rowClickHandler = () => {
    navigate(`/${chainId}/pools/${eap.address}`);
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
    <tr onClick={rowClickHandler}>
      <td>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img style={{ width: '2rem', marginRight: '1rem' }} src={eap.underlyingLogo} alt="" />
          <span>{eap.underlyingSymbol}</span>
        </div>
      </td>
      <td>
        <Tippy content={`Based on onchain data for the last ${eap.apyAfterFee[0].period}s`}>
          <span className="apy-content">{Number(eap.apyAfterFee[0].apy).toFixed(2)}%</span>
        </Tippy>
      </td>
      <td>
        <Tippy content={`~$${eap.TVL_USD}`}>
          <span>{Number(eap.totalUnderlyingBalance.formatted).toFixed(3)}</span>
        </Tippy>
      </td>
      <td>
        <Tippy content={`~$${eap.accountAllocatedUSD}`}>
          <span>{Number(eap.accountAllocated.formatted).toFixed(3)}</span>
        </Tippy>
      </td>
      <td>
        <Tippy content={`~$${balanceUsd}`}>
          <span>{Number(balance).toFixed(3)}</span>
        </Tippy>
      </td>
    </tr>
  );
};

export default PoolRow;
