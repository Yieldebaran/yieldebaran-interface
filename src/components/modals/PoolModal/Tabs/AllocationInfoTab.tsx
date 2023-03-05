import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import React, { useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { EapData } from 'src/classes/AppState';
import { useContractsData } from 'src/providers/ContractsDataProvider';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  selectedPool: string;
}

const AllocationInfoTab: React.FC<Props> = (props: Props) => {
  const { eapStates } = useContractsData();

  const mounted = useRef<boolean>(false);

  const eap: EapData = eapStates[props.selectedPool];

  const data = eap.allocations.map((x) => Number(x.underlyingAllocated.formatted));

  const total = Number(eap.totalUnderlyingBalance.formatted);

  const backgroundColor = data.map((x) => getColor(x));
  const borderColor = data.map(
    (x) => `rgba(${(255 * x) / total}, ${(255 * x) / total}, ${(255 * x) / total}, 1)`,
  );

  const labels = eap.allocations.map(
    (x) => `${x.allocationName} (APY: ${x.currentApy.apy.toFixed(1)}%)`,
  );

  const pieConfig = {
    labels,
    datasets: [
      {
        label: 'allocated',
        data: data,
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  };

  return eap && mounted ? (
    <>
      <div className="modal-title">
        Allocation status
      </div>
      <Doughnut data={pieConfig} />
      <div className="text-in-modal">
        <a href={`https://debank.com/profile/${eap.address}`}>Validate on DeBank</a>
      </div>
    </>
  ) : null;
};

function getColor(value: number): string {
  return ['hsl(', value, ',100%,50%)'].join('');
}

export default AllocationInfoTab;
