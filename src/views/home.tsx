import React from 'react';
import { Spinner } from 'src/assets/huIcons/huIcons';
import PoolRow from 'src/components/PoolsList/PoolRow';
import { useContractsData } from 'src/providers/ContractsDataProvider';
import { MainBlock } from 'src/uiKit/MainBlock';
import styled from 'styled-components';

const TableContainer = styled.div`
  width: 100%;
  overflow: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  max-width: 100%;
  overflow: auto;
  border-collapse: collapse;
  margin-top: 4rem;
  text-align: right;
  white-space: nowrap;
  td,
  th {
    padding: 1rem;
  }
  td:first-child,
  th:first-child {
    text-align: left;
  }
  th {
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  }
  tbody {
    tr {
      cursor: pointer;
      :not(:last-child) td {
        border-bottom: 1px solid rgba(255, 255, 255, 0.4);
      }
    }
  }
`;

export const Home: React.FC = () => {
  const { eapStates, fetching } = useContractsData();

  // render main logic frame
  return (
    <MainBlock>
      <h1 style={{ textAlign: 'center' }}>Efficiently allocating pools</h1>
      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>Asset</th>
              <th>APY</th>

              <th>Total assets</th>
              <th>Your deposit</th>
              <th>On wallet</th>
            </tr>
          </thead>
          {
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan={1000} style={{ textAlign: 'center' }}>
                    <Spinner size={'30px'} />
                  </td>
                </tr>
              ) : Object.keys(eapStates).length === 0 ? null : (
                Object.keys(eapStates).map((pool, index) => {
                  return <PoolRow key={index} pool={pool} />;
                })
              )}
            </tbody>
          }
        </StyledTable>
      </TableContainer>
    </MainBlock>
  );
};
