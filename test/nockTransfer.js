/*jslint node: true */
/*jslint unparam: true */

var nock     = require('nock');


var EXPIRE_REGEX = /\?expire=[0-9]+/g;
var TEST_BASE_URI = 'http://mockapi.coinbase.com/v2/';

var XFER_1 = {
  "id": "9901234",
  "type": "Buy",
  "code": "QPCUCZHR",
  "created_at": "2013-02-27T23:28:18-08:00",
  "fees": {
  "coinbase": {
  "cents": 14,
  "currency_iso": "USD"
  },
  "bank": {
    "cents": 15,
    "currency_iso": "USD"
  }
  },
  "payout_date": "2013-03-05T18:00:00-08:00",
  "transaction_id": "5011f33df8182b142400000e",
  "status": "Pending",
  "btc": {
    "amount": "1.00000000",
    "currency": "BTC"
  },
  "subtotal": {
    "amount": "13.55",
    "currency": "USD"
  },
  "total": {
    "amount": "13.84",
    "currency": "USD"
  },
  "description": "Paid for with $13.84 from Test xxxxx3111."
};

var ACCT = {
  "id": "544955d2629122efb000000f"
};


var COMMIT_RESP = {
  "data": {
    "id": "5474d23a629122e172000238",
    "created_at": "2014-11-25T11:03:22-08:00",
    "fees": {
      "coinbase": {
        "cents": 0,
        "currency_iso": "EUR"
      },
      "bank": {
        "cents": 0,
        "currency_iso": "EUR"
      }
    },
    "payout_date": "2014-11-25T11:02:18-08:00",
    "transaction_id": "5474d287629122e172000240",
    "_type": "AchDebit",
    "code": "5474d23a629122e172000238",
    "type": "Buy",
    "status": "Pending",
    "detailed_status": "started",
    "btc": {
      "amount": "0.37200000",
      "currency": "BTC"
    },
    "subtotal": {
      "amount": "3.00",
      "currency": "EUR"
    },
    "total": {
      "amount": "3.00",
      "currency": "EUR"
    },
    "description": "Bought 0.372 BTC for €3.00.",
    "account": "544955d2629122efb000000f",
    "payment_method": {
      "id": "545348f26291223ddc00011f",
      "name": "EUR Wallet",
      "can_buy": true,
      "can_sell": true,
      "account_id": "545348f26291223ddc00011e"
    }
  }
};

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post('/accounts/544955d2629122efb000000f/buys/' + XFER_1.id + '/commit')
  .reply(200, function(uri, requestBody) {
    return COMMIT_RESP;
  });

module.exports.XFER_1            = XFER_1       ;
module.exports.ACCT              = ACCT         ;
module.exports.TEST_BASE_URI     = TEST_BASE_URI;
module.exports.COMMIT_RESP       = COMMIT_RESP  ;

