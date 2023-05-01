import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import React, { useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useContractsData } from 'src/providers/ContractsDataProvider';

ChartJS.register(ArcElement, Tooltip, Legend);

const PIE_OPTIONS = {
  plugins: {
    legend: {
      labels: {
        color: '#fff',
      },
    },
  },
};

export const AllocationInfoTab = () => {
  const { eap } = useContractsData();

  const mounted = useRef<boolean>(false);

  const data = eap?.allocations.map((x) => Number(x.underlyingAllocated.formatted));

  const backgroundColor = data?.map((x) => getColor(x));

  const labels = eap?.allocations.map(
    (x) => `${x.allocationName} (APY: ${x.currentApy.apy.toFixed(1)}%)`,
  );

  const pieData = {
    labels,
    datasets: [
      {
        label: 'allocated',
        data: data,
        backgroundColor,
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  function getColor(value: number): string {
    return ['hsl(', value, ',100%,50%)'].join('');
  }

  return eap && mounted ? (
    <>
      <div className="modal-title">Allocation status</div>
      <Doughnut data={pieData} options={PIE_OPTIONS} />
      <div className="text-in-modal">
        <a
          style={{ color: 'inherit' }}
          target="_blank"
          rel="noreferrer"
          href={`https://debank.com/profile/${eap.address}`}
        >
          Validate on DeBank
        </a>
      </div>
    </>
  ) : null;
};
