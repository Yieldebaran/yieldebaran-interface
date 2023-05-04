import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'PP Supply Mono';
    src: url('/fonts/PPSupply/PPSupplyMono-Ultralight.woff2') format('woff2'),
    url('/fonts/PPSupply/PPSupplyMono-Ultralight.woff') format('woff'),
    url('/fonts/PPSupply/PPSupplyMono-Ultralight.ttf') format('truetype');
    font-weight: 200;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'PP Supply Mono';
    src: url('/fonts/PPSupply/PPSupplyMono-Regular.woff2') format('woff2'),
    url('/fonts/PPSupply/PPSupplyMono-Regular.woff') format('woff'),
    url('/fonts/PPSupply/PPSupplyMono-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'PP Supply Sans';
    src: url('/fonts/PPSupply/PPSupplySans-Regular.woff2') format('woff2'),
    url('/fonts/PPSupply/PPSupplySans-Regular.woff') format('woff'),
    url('/fonts/PPSupply/PPSupplySans-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'PP Supply Sans';
    src: url('/fonts/PPSupply/PPSupplySans-Ultralight.woff2') format('woff2'),
    url('/fonts/PPSupply/PPSupplySans-Ultralight.woff') format('woff'),
    url('/fonts/PPSupply/PPSupplySans-Ultralight.ttf') format('truetype');
    font-weight: 200;
    font-style: normal;
    font-display: swap;
  }
  
  * {
    box-sizing: border-box;
  }

  html {
    font-family: 'PP Supply Sans', sans-serif;
    color: #fff;
  }
  
  html, body {
    background: transparent;
  }
  
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    align-content: stretch;
    > div {
      width: 100%;
    }
  }
  
  a {
    color: inherit;
  }
`;
