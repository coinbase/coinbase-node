/*jslint node: true */
/*jslint unparam: true */

var nock = require('nock');


var EXPIRE_REGEX = /\?expire=[0-9]+/g;
var TEST_BASE_URI = 'http://mockapi.coinbase.com/v2/';

var REFUND_RESP = {
  "data": {
    "id": "YYZQ6RN4",
    "created_at": "2014-06-17T16:03:53-07:00",
    "status": "completed",
    "event": null,
    "total_btc": {
      "cents": 10000000,
      "currency_iso": "BTC"
    },
    "total_native": {
      "cents": 100,
      "currency_iso": "USD"
    },
    "total_payout": {
      "cents": 100,
      "currency_iso": "USD"
    },
    "custom": "",
    "receive_address": "mmUFLyAtF89mcvStdobiby3xFpdLARQhNw",
    "button": {
    "type": "buy_now",
    "name": "asdfasdf",
    "description": "",
    "id": "320421614991df1e2d526b8169644067"
    },
    "refund_address": "n49yYq81iZxqyKj2ys85ErXLJp9EBPNqis",
    "transaction": {
      "id": "53a0c9ee137f734abb0001db",
      "hash": "5d4751d532ba6845f09c24d21a8b1153e96f2b19fcfab84591b3a3be78648998",
      "confirmations": 101
    },
    "refund_transaction": {
      "id": "53a22f33137f734abb000296",
      "hash": "ce401504150a02618ca8ee93e5b948c59e30040b6101473a07a97e77c6c4be1c",
      "confirmations": 0
    }
  }
};

var refund_uri = '/orders/' + REFUND_RESP.data.id + '/refund';
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post(refund_uri)
  .reply(200, function(uri, requestBody) {
    return REFUND_RESP;
  });

module.exports.TEST_BASE_URI     = TEST_BASE_URI    ;
module.exports.REFUND_RESP       = REFUND_RESP      ;

