# Coinbase

The official Node.js library for the [Coinbase API](https://developers.coinbase.com/api).

## Features

* Full Test coverage.
* Support for both [API Key + Secret](https://coinbase.com/docs/v1/api/authentication#hmac) and [OAuth 2](https://coinbase.com/docs/v1/api/authentication#oauth2) authentication.
* Convenient methods for making calls to the API.
* Automatic parsing of API responses into relevant Javascript objects.
* Adheres to the nodejs error-first callback protocol.
* Continuous Integration testing against node 0.10, 0.11, and 0.12.

## Installation

`npm install coinbase`

## Version Compatibility

Version | GitHub repository
--------|------------------
`1.0.x` | This repository
`0.1.x` | [mateodelnorte/coinbase](https://github.com/mateodelnorte/coinbase)

Npm `coinbase` package name used to refer to the unofficial [coinbase](https://github.com/mateodelnorte/coinbase) library maintained by [Matt Walters](https://github.com/mateodelnorte). Matt graciously allowed us to use the name for this package instead. You can still find that package on [Github](https://github.com/mateodelnorte/coinbase). Thanks, Matt.

## Quick Start

The first thing you'll need to do is [sign up for coinbase](https://coinbase.com).

## API Key

If you're writing code for your own Coinbase account, [enable an API key](https://coinbase.com/settings/api). Next, create a ``Client`` object for interacting with the API:


```javascript
var Client = require('coinbase').Client;
var client = new Client({'apiKey': mykey, 'apiSecret': mysecret});
```

## OAuth2

If you're writing code that will act on behalf of another user, start by
[creating a new OAuth 2 application](https://coinbase.com/oauth/applications). You will need to do some work to obtain OAuth credentials for your users; while outside the scope of this document, please refer to our [OAuth 2 tutorial](https://www.coinbase.com/docs/v1/api/oauth_tutorial) and [documentation](https://www.coinbase.com/docs/v1/api/authentication#oauth2). Once you have these credentials, create a client:

```javascript
var Client = require('coinbase').Client;
var client = new Client({'accessToken': accessToken, 'refreshToken': refreshToken});
```

## Coinbase Sandbox

To use this library with Coinbase Sandbox, you need to initialize the library with following params:

```javascript
var Client = require('coinbase').Client;
var client = new Client({
  < api keys or access tokens here>
  'baseApiUri': 'https://api.sandbox.coinbase.com/v1/',
  'tokenUri': 'https://api.sandbox.coinbase.com/oauth/token'
});
```

## Making API Calls

With a `client instance`, you can now make API calls. We've included some examples below, but in general the library has Javascript prototypes for each of the objects described in our [REST API documentation](https://developers.coinbase.com/api).  These classes each have methods for making the relevant API calls; for instance, ``coinbase.model.Transaction.complete`` maps to the [complete bitcoin request](https://developers.coinbase.com/api/v1#complete-bitcoin-request) API endpoint. The comments of each method in the code references the endpoint it implements. Each API method returns an ``object`` representing the JSON response from the API.

**Listing available accounts**

```javascript
var coinbase = require('coinbase');
var client   = new coinbase.Client({'apiKey': mykey, 'apiSecret': mysecret});

client.getAccounts(function(err, accounts) {
  accounts.forEach(function(acct) {
    console.log('my bal: ' + acct.balance.amount + ' for ' + acct.name);
  });
});
```

**Get Balance from an Account Id**

```javascript
var Account   = require('coinbase').model.Account;
var myBtcAcct = new Account(client, {'id': '<SOME_ACCOUNT_ID>'});

myBtcAcct.getBalance(function(err, bal) {
  console.log('bal: ' + bal.amount + ' currency: ' + bal.currency);
});
```

**Selling bitcoin**

```javascript
var args = {
  "qty": "12"
};
account.sell(args, function(err, xfer) {
  console.log('my xfer id is: ' + xfer.id);
});
```

**Sending bitcoin**

```javascript
var args = {
  "to": "user1@example.com",
  "amount": "1.234",
  "notes": "Sample transaction for you"
};
account.sendMoney(args, function(err, txn) {
  console.log('my txn id is: ' + txn.id);
});
```

**Requesting bitcoin**

```javascript
var args = {
  "from": "user1@example.com",
  "amount": "1.234",
  "notes": "Sample transaction for you"
};
account.requestMoney(args, function(err, txn) {
  console.log('my txn id is: ' + txn.id);
});
```

**Listing current transactions**

```javascript
account.getTransactions(null, null, function(err, txns) {
  txns.forEach(function(txn) {
    console.log('my txn status: ' + txn.status);
  });
});
```

**Checking bitcoin prices**

```javascript
client.getBuyPrice({'qty': 100, 'currency': 'USD'}, function(err, obj) {
  console.log('total amount: ' + obj.total.amount);
});
```

## Error Handling

Errors are thrown for invalid arguments but are otherwise returned as the
first argument to callback functions.

Errors contain `type` properties so that you can route the error to the
right handler code.  The possible types are:

Type | Description
 ---- | -----------
AuthenticationError | returned if there was an authentication error
InvalidAccessToken | returned when the current access token is no longer valid
ExpiredAccessToken | returned when the current access token is expired
TokenRefreshError | returned when there is a failure refreshing the access token
TwoFactorTokenRequired | returned when a user's Two Factor Auth token needs to be included in the request
APIError | returned for errors related to interacting with the Coinbase API server

```javascript
acct.getBalance(function(err, bal) {
  switch (err.type) {
    case 'ExpiredAccessToken':
      // use the client.refresh API to get a new access_token
      break;
    case 'InvalidAccessToken':
      //handle error
      break;
    case 'AuthenticationError':
      //handle error
      break;
    }
});
```

Errors are always of the type `Error` and can print a trace:

```javascript
acct.getBalance(function(err, bal) {
  if (err) console.log('Where did this error come from?\n' + err.stack);
});
```

Errors that are related to an http request will have a `response` field with the entire http response:

```javascript
acct.getBalance(function(err, bal) {
  if (err) console.log('http error code: ' + err.response.statusCode);
});
```

## Testing / Contributing

Any and all contributions are welcome! The process is simple:

1. Fork this repo
2. Make your changes and add tests
3. Run the test suite
4. Submit a pull request.

Tests are run via [mocha](http://mochajs.org) and [nock](https://github.com/pgte/nock). To run the tests, clone the repository and then:

`npm install`

`npm test`

You can also run the tests against various node environments using the Dockerfile.example file.

1. `cp Dockerfile.example Dockerfile`
2. edit Dockerfile and uncomment the node version that interests you
3. `[sudo] docker build -t coinbase-node .`
4. `[sudo] docker run -it coinbase-node`

## More Documentation

You can generate html documentation by running the command:

`npm install && npm run docs`

Open generated html files in `docs/` dir with a browser.
