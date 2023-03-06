  - kind: ethereum/contract
    name: FastPriceFeed
    network: telos_testnet
    source:
      address: "0xAbbAB804bE1753255a57b7607c286dbeA620D4e5"
      abi: FastPriceFeed
      startBlock: 217831382
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.4
      language: wasm/assemblyscript
      entities:
        - FastPrice
      abis:
        - name: FastPriceFeed
          file: ./abis/FastPriceFeed.json
      eventHandlers:
        - event: SetPrice(address,uint256)
          handler: handleSetPrice
      file: ./src/pricesMapping.ts


    (line 168)

telos_testnet:https://testnet.telos.net/evm