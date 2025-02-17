import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppearanceProvider } from 'src/providers/AppearanceProvider';
import { ChainProvider } from 'src/providers/ChainProvider';
import { ContractsDataProvider } from 'src/providers/ContractsDataProvider';
import { StoreProvider } from 'src/providers/StoreProvider';
import { GlobalStyles } from 'src/uiKit/GlobalStyles';

import App from './App';

import './index.css';

import reportWebVitals from './reportWebVitals';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <>
    <GlobalStyles />
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChainProvider>
        <AppearanceProvider>
          <StoreProvider>
            <ContractsDataProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ContractsDataProvider>
          </StoreProvider>
        </AppearanceProvider>
      </ChainProvider>
    </Web3ReactProvider>
  </>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
