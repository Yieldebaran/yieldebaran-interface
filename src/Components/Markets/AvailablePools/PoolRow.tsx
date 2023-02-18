import Tippy from '@tippyjs/react';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import React from 'react';
import { useNavigate } from 'react-router-dom'; // optional
import 'tippy.js/dist/tippy.css';
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
    if (!account) {
      setShowWallets(true);
      return;
    }
    if (props.pool) {
      props.supplyMarketDialog(props.pool);
    }
  };

  const balance = formatBN(eap.accountUnderlyingBalance.native + (eap.isEth ? accountEthBalance.native : 0n), 18);

  return (
    <tr onClick={handleOpenSupplyMarketDialog}>
      <td>
        <div className="asset">
          <div className="asset-logo">
            <img className="rounded-circle" src={eap.underlyingLogo} alt="" />
          </div>
          <span>{eap.underlyingSymbol}</span>
        </div>
      </td>
      <td className="apy positive">
        <div className="supply-apy">
          <div className="apy-content">{Number(eap.apyAfterFee[0].apy).toFixed(2)}%</div>
        </div>
      </td>
      <td>
        {
          <Tippy content={eap.totalUnderlyingBalance.formatted}>
            <div>{Number(eap.totalUnderlyingBalance.formatted).toFixed(3)}</div>
          </Tippy>
        }
      </td>
      <td>
        {
          <Tippy content={eap.accountAllocated.formatted}>
            <div>{Number(eap.accountAllocated.formatted).toFixed(2)}</div>
          </Tippy>
        }
      </td>
      <td>
        {
          <Tippy content={balance}>
            <div>{Number(balance).toFixed(2)}</div>
          </Tippy>
        }
      </td>
    </tr>
  );
};

export default PoolRow;
