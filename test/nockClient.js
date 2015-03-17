/*jslint node: true */
/*jslint unparam: true */

var nock     = require('nock');

var EXPIRE_REGEX = /\?expire=[0-9]+/g;
var TEST_BASE_URI = 'http://mockapi.coinbase.com/v1/';
var ACCOUNTS_ID_1 = '54a710dd25dc9a311800003f';
var ACCOUNTS_ID_2 = '54a710dd25dc9a311800003g';
var GET_ACCOUNTS_RESP = {'current_page': 1,
                         'num_pages': 1,
                         'total_count': 3,
                         'accounts': [
                            {'id': ACCOUNTS_ID_1},
                            {'id': ACCOUNTS_ID_2}
                         ]
};

var scope1 = nock(TEST_BASE_URI)
                .filteringPath(EXPIRE_REGEX, '')
                .get('/accounts')
                .reply(200, GET_ACCOUNTS_RESP);

var GET_ACCOUNT_RESP = {
  "account": {
  "id": ACCOUNTS_ID_1,
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
  "success": true,
  "account": {
    "id": "537cfb1146cd93b85d00001e",
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
  .reply(200, function(uri, body) {
    var args = JSON.parse(body);
    if (args.account.name === NEW_ACCOUNT_NAME_1) {
      return CREATE_ACCOUNT_RESP;
    }
    return null;
  });

var GET_CONTACTS_RESP = {
  "contacts": [
    {
      "contact": {
        "email": "user1@example.com"
      }
    }
  ],
  "total_count": 1,
  "num_pages": 1,
  "current_page": 1
};
nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/contacts?page=2&limit=9&query=1234&expire=XXX')
  .reply(200, function(uri, body) {
    return GET_CONTACTS_RESP;
  });

var GET_CURRENT_USER_RESP = {
  "user": {
  "id": "512db383f8182bd24d000001",
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
  .get('/users/self')
  .reply(200, function(uri, body) {
    return GET_CURRENT_USER_RESP;
  });

var GET_BUY_PRICE_RESP = {
  "btc": {
  "amount": "1.00000000",
  "currency": "BTC"
  },
  "subtotal": {
  "amount": "10.10",
  "currency": "USD"
  },
  "fees": [
  {
  "coinbase": {
  "amount": "0.10",
  "currency": "USD"
  }
  },
  {
  "bank": {
  "amount": "0.15",
  "currency": "USD"
  }
  }
  ],
  "total": {
  "amount": "10.35",
  "currency": "USD"
  }
};
nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/prices/buy?qty=2&currency=USD&expire=XXX')
  .reply(200, function(uri, body) {
    return GET_BUY_PRICE_RESP;
  });

var GET_SELL_PRICE_RESP = {
  "subtotal": {
    "amount": "9.90",
    "currency": "USD"
  },
  "fees": [
    {
      "coinbase": {
        "amount": "0.10",
        "currency": "USD"
      }
    },
    {
      "bank": {
        "amount": "0.15",
        "currency": "USD"
      }
    }
  ],
  "total": {
    "amount": "9.65",
    "currency": "USD"
  },
  "amount": "9.65",
  "currency": "USD"
};

nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/prices/sell?qty=3&currency=USD&expire=XXX')
  .reply(200, function(uri, body) {
    return GET_SELL_PRICE_RESP;
  });

var GET_SPOT_RESP = {"amount":"239.16","currency":"USD"};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
 .get('/prices/spot_rate')
 .reply(200, function(uri, body) {
   return GET_SPOT_RESP;
 });

var GET_CURRENCIES_RESP = [
  ["Afghan Afghani (AFN)","AFN"],
  ["Albanian Lek (ALL)","ALL"],
  ["Algerian Dinar (DZD)","DZD"],
  ["Zimbabwean Dollar (ZWL)","ZWL"]
  ];
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
 .get('/currencies')
 .reply(200, function(uri, body) {
   return GET_CURRENCIES_RESP;
 });

var GET_EX_RATES_RESP = {
  "aed_to_btc": "0.000851",
  "aed_to_usd": "0.272255",
  "zwl_to_btc": "0.00001",
  "zwl_to_usd": "0.003102"
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
 .get('/currencies/exchange_rates')
 .reply(200, function(uri, body) {
   return GET_EX_RATES_RESP;
 });

var CREATE_USER_RESP = {
  "success": true,
  "user": {
    "id": "501a3d22f8182b2754000011",
    "name": "New User",
    "email": "newuser@example.com"
  },
  "receive_address": "mpJKwdmJKYjiyfNo26eRp4j6qGwuUUnw9x"
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post('/users')
  .reply(200, function(uri, body) {
    var args = JSON.parse(body);
    if (args.user.email === CREATE_USER_RESP.user.email) {
      return CREATE_USER_RESP;
    }
    return null;
  });

var GET_PAYMENT_METHODS_RESP = {
  "payment_methods": [
    {
    "payment_method": {
      "id": "530eb5b217cb34e07a000011",
      "name": "US Bank ****4567",
      "can_buy": true,
      "can_sell": true
    }
    },
    {
    "payment_method": {
      "id": "530eb7e817cb34e07a00001a",
      "name": "VISA card 1111",
      "can_buy": false,
      "can_sell": false
    }
    }
  ],
  "default_buy": "530eb5b217cb34e07a000011",
  "default_sell": "530eb5b217cb34e07a000011"
};
nock(TEST_BASE_URI)
 .filteringPath(EXPIRE_REGEX, '')
 .get('/payment_methods')
 .reply(200, function(uri, body) {
   return GET_PAYMENT_METHODS_RESP;
 });

var GET_PAYMENT_METHOD_RESP = {
  "payment_method": {
    "id": "530eb5b217cb34e07a000011",
    "name": "US Bank ****4567",
    "can_buy": true,
    "can_sell": true
  }
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .get('/payment_methods/' + GET_PAYMENT_METHOD_RESP.payment_method.id)
  .reply(200, function(uri, body) {
    return GET_PAYMENT_METHOD_RESP;
  });

module.exports.ACCOUNTS_ID_1            = ACCOUNTS_ID_1           ;
module.exports.ACCOUNTS_ID_2            = ACCOUNTS_ID_2           ;
module.exports.NEW_ACCOUNT_NAME_1       = NEW_ACCOUNT_NAME_1      ;
module.exports.CREATE_ACCOUNT_RESP      = CREATE_ACCOUNT_RESP     ;
module.exports.CREATE_USER_RESP         = CREATE_USER_RESP        ;
module.exports.GET_ACCOUNTS_RESP        = GET_ACCOUNTS_RESP       ;
module.exports.GET_ACCOUNT_RESP         = GET_ACCOUNT_RESP        ;
module.exports.GET_BUY_PRICE_RESP       = GET_BUY_PRICE_RESP      ;
module.exports.GET_CONTACTS_RESP        = GET_CONTACTS_RESP       ;
module.exports.GET_CURRENCIES_RESP      = GET_CURRENCIES_RESP     ;
module.exports.GET_CURRENT_USER_RESP    = GET_CURRENT_USER_RESP   ;
module.exports.GET_EX_RATES_RESP        = GET_EX_RATES_RESP       ;
module.exports.GET_PAYMENT_METHODS_RESP = GET_PAYMENT_METHODS_RESP;
module.exports.GET_PAYMENT_METHOD_RESP  = GET_PAYMENT_METHOD_RESP ;
module.exports.GET_SELL_PRICE_RESP      = GET_SELL_PRICE_RESP     ;
module.exports.GET_SPOT_RESP            = GET_SPOT_RESP           ;
module.exports.TEST_BASE_URI            = TEST_BASE_URI           ;

