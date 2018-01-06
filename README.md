Fork of the [official Node.js library](https://github.com/coinbase/coinbase-node) for the [Coinbase API](https://developers.coinbase.com/api/v2) with browser support.

## Installation

`npm install https://github.com/VirtusAI/coinbase-node`

## Browser Usage

```HTML
<script type="text/javascript" src="./node_modules/coinbase/build/browser.js"></script>
```

Creates a global `coinbase` object:

```JavaScript
var client = new coinbase.Client({'apiKey': apiKey, 'apiSecret': secret});
```

## Browser Build from Source

`npm run-script browserify`

