/*jslint node: true */
/*jslint unparam: true */

var nock     = require('nock');


var EXPIRE_REGEX = /\?expire=[0-9]+/g;
var TEST_BASE_URI = 'http://mockapi.coinbase.com/v2/';

var USER_1 = {
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
};

var MODIFY_RESP = {
  "data": {
    "id": "512db383f8182bd24d000001",
    "name": "User One",
    "email": "user@example.com",
    "time_zone": "Pacific Time (US & Canada)",
    "native_currency": "CAD",
    "buy_level": 1,
    "sell_level": 1,
    "balance": {
      "amount": "49.76000000",
      "currency": "BTC"
    },
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
  .put('/user', {'native_currency': 'CAD'})
  .reply(200, function(uri, requestBody) {
    var args = JSON.parse(requestBody);
    return MODIFY_RESP;
  });

module.exports.USER_1            = USER_1        ;
module.exports.TEST_BASE_URI     = TEST_BASE_URI ;
module.exports.MODIFY_RESP       = MODIFY_RESP   ;

