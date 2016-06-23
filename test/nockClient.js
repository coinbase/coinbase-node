/*jslint node: true */
/*jslint unparam: true */

var nock     = require('nock');

var EXPIRE_REGEX = /\?expire=[0-9]+/g;
var TEST_BASE_URI = 'http://mockapi.coinbase.com/v2/';
var ACCOUNTS_ID_1 = '54a710dd25dc9a311800003f';
var ACCOUNTS_ID_2 = '54a710dd25dc9a311800003g';
var GET_ACCOUNTS_RESP = {
  'data': [
    {'id': ACCOUNTS_ID_1, 'resource': 'account'},
    {'id': ACCOUNTS_ID_2, 'resource': 'account'}
   ]
};

var scope1 = nock(TEST_BASE_URI)
                .filteringPath(EXPIRE_REGEX, '')
                .get('/accounts')
                .reply(200, GET_ACCOUNTS_RESP);

var GET_ACCOUNT_RESP = {
  "data": {
  "id": ACCOUNTS_ID_1,
  "resource": "account",
  "name": "My Wallet",
  "balance": {
  "amount": "50.00000000",
  "currency": "BTC"
  },
  "native_balance": {
  "amount": "500.12",
  "currency": "USD"
  },
  "created_at": "2014-05-07T08:41:19-07:00",
  "primary": true,
  "active": true,
  "type": "wallet"
  }
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .get('/accounts/' + ACCOUNTS_ID_1)
  .reply(200, function(uri, body) {
    return GET_ACCOUNT_RESP;
  });

var NEW_ACCOUNT_NAME_1 = 'my new wallet 1';
var CREATE_ACCOUNT_RESP = {
  "data": {
    "id": "537cfb1146cd93b85d00001e",
    "resource": "account",
    "name": NEW_ACCOUNT_NAME_1,
    "active": true,
    "created_at": "2014-05-21T12:14:25-07:00",
    "balance": {
      "amount": "0.00000000",
      "currency": "BTC"
    },
    "native_balance": {
      "amount": "0.00",
      "currency": "USD"
    },
    "primary": false,
    "type": "wallet"
  }
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post('/accounts')
  .reply(201, function(uri, body) {
    return CREATE_ACCOUNT_RESP;
  });

var GET_CURRENT_USER_RESP = {
  "data": {
    "id": "512db383f8182bd24d000001",
    "resource": "user",
    "name": "User One",
    "email": "user1@example.com",
    "time_zone": "Pacific Time (US & Canada)",
    "native_currency": "USD",
    "balance": {
      "amount": "49.76000000",
      "currency": "BTC"
    },
    "merchant": {
      "company_name": "Company Name, Inc.",
      "logo": {
      "small": "http://smalllogo.example",
      "medium": "http://mediumlogo.example",
      "url": "http://logo.example"
      }
    },
    "buy_level": 1,
    "sell_level": 1,
    "buy_limit": {
    "amount": "1000",
    "currency": "USD"
    },
    "sell_limit": {
    "amount": "1000",
    "currency": "USD"
    }
  }
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .get('/user')
  .reply(200, function(uri, body) {
    return GET_CURRENT_USER_RESP;
  });

var GET_BUY_PRICE_RESP = {
  "data": {
    "amount": "100.00",
    "currency": "usd"
  }
};
nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/prices/BTC-USD/buy')
  .thrice()
  .reply(200, function(uri, body) {
    return GET_BUY_PRICE_RESP;
  });

var GET_SELL_PRICE_RESP = {
  "data": {
    "amount": "100.00",
    "currency": "usd"
  }
};
nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/prices/BTC-USD/sell')
  .thrice()
  .reply(200, function(uri, body) {
    return GET_SELL_PRICE_RESP;
  });

var GET_SPOT_RESP = {
  "data": {
    "amount": "239.16",
    "currency": "USD"
  }
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
 .get('/prices/BTC-USD/spot')
 .thrice()
 .reply(200, function(uri, body) {
   return GET_SPOT_RESP;
 });

var GET_CURRENCIES_RESP = {
  "data": [
    {
      "id": "AED",
      "name": "United Arab Emirates Dirham",
      "min_size": "0.01000000"
    },
    {
      "id": "AFN",
      "name": "Afghan Afghani",
      "min_size": "0.01000000"
    },
    {
      "id": "ALL",
      "name": "Albanian Lek",
      "min_size": "0.01000000"
    },
    {
      "id": "AMD",
      "name": "Armenian Dram",
      "min_size": "0.01000000"
    }
  ]
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
 .get('/currencies')
 .reply(200, function(uri, body) {
   return GET_CURRENCIES_RESP;
 });

var GET_EX_RATES_RESP = {
  "data": {
    "currency": "BTC",
    "rates": {
      "AED": "36.73",
      "AFN": "589.50",
      "ALL": "1258.82",
      "AMD": "4769.49",
      "ANG": "17.88",
      "AOA": "1102.76",
      "ARS": "90.37",
      "AUD": "12.93",
      "AWG": "17.93",
      "AZN": "10.48",
      "BAM": "17.38"
    }
  }
};

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
 .get('/exchange-rates')
 .reply(200, function(uri, body) {
   return GET_EX_RATES_RESP;
 });

var GET_PAYMENT_METHODS_RESP = {
  "data": [
    {
      "id": "530eb5b217cb34e07a000011",
      "resource": "payment_method",
      "name": "US Bank ****4567",
      "can_buy": true,
      "can_sell": true
    },
    {
      "id": "530eb7e817cb34e07a00001a",
      "resource": "payment_method",
      "name": "VISA card 1111",
      "can_buy": false,
      "can_sell": false
    }
  ],
};
nock(TEST_BASE_URI)
 .filteringPath(EXPIRE_REGEX, '')
 .get('/payment-methods')
 .reply(200, function(uri, body) {
   return GET_PAYMENT_METHODS_RESP;
 });

var GET_PAYMENT_METHOD_RESP = {
  "data": {
    "id": "530eb5b217cb34e07a000011",
    "resource": "payment_method",
    "name": "US Bank ****4567",
    "can_buy": true,
    "can_sell": true
  }
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .get('/payment-methods/' + GET_PAYMENT_METHOD_RESP.data.id)
  .reply(200, function(uri, body) {
    return GET_PAYMENT_METHOD_RESP;
  });

module.exports.ACCOUNTS_ID_1            = ACCOUNTS_ID_1           ;
module.exports.ACCOUNTS_ID_2            = ACCOUNTS_ID_2           ;
module.exports.NEW_ACCOUNT_NAME_1       = NEW_ACCOUNT_NAME_1      ;
module.exports.CREATE_ACCOUNT_RESP      = CREATE_ACCOUNT_RESP     ;
module.exports.GET_ACCOUNTS_RESP        = GET_ACCOUNTS_RESP       ;
module.exports.GET_ACCOUNT_RESP         = GET_ACCOUNT_RESP        ;
module.exports.GET_BUY_PRICE_RESP       = GET_BUY_PRICE_RESP      ;
module.exports.GET_CURRENCIES_RESP      = GET_CURRENCIES_RESP     ;
module.exports.GET_CURRENT_USER_RESP    = GET_CURRENT_USER_RESP   ;
module.exports.GET_EX_RATES_RESP        = GET_EX_RATES_RESP       ;
module.exports.GET_PAYMENT_METHODS_RESP = GET_PAYMENT_METHODS_RESP;
module.exports.GET_PAYMENT_METHOD_RESP  = GET_PAYMENT_METHOD_RESP ;
module.exports.GET_SELL_PRICE_RESP      = GET_SELL_PRICE_RESP     ;
module.exports.GET_SPOT_RESP            = GET_SPOT_RESP           ;
module.exports.TEST_BASE_URI            = TEST_BASE_URI           ;

