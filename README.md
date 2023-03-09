# yieldebaran-interface

This repo contains React-based web interface for Yieldebaran Efficiently Rebalancing Protocol

Initially forked from hundred-interface, they let me use it after I [asked nicely](https://discordapp.com/channels/756024964448256011/756444602315309136/1075981517903376414).

Changes introduced: 

- App state changed to support Yieldebaran contracts
- Websocket integration: added updates on events issued by contracts
- Small changes in Network selection modal
- Small UI changes
- Introduced github pages to support live deployment hosted by github.io on [yieldebaran.xyz](https://yieldebaran.xyz)

Corresponding contracts repo [yieldebaran-contracts](https://github.com/yieldebaran/yieldebaran-contracts)

## Running locally 

```bash
yarn && yarn start
```

## Why the app works so smoothly

To load all the data we perform only a couple of aggregated requests [here](src/Yieldebaran/Data/fetchEapsData.ts) and one to the [FTMScan API](https://ftmscan.com/apis) to get the 7d old block number in order to calculate 7d avg APY
