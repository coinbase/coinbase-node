/*jslint node: true */
/*jslint unparam: true */

var nock     = require('nock');

var EXPIRE_REGEX = /\?expire=[0-9]+/g;
var TEST_BASE_URI = 'http://mockapi.coinbase.com/v1/';
var ACCOUNT_1 = {
  "id": "1234",
  "balance": {
    "amount":"0.07",
    "currency": "BTC"
  }
};

var TXN_1 = {
  "id": "T1234",
  "created_at": "2012-08-01T02:34:43-07:00",
  "amount": {
    "amount": "-1.10000000",
    "currency": "BTC"
  },
  "request": true,
  "status": "pending",
  "sender": {
    "id": "5011f33df8182b142400000e",
    "name": "User Two",
    "email": "user2@example.com"
  },
  "recipient": {
    "id": "5011f33df8182b142400000a",
    "name": "User One",
    "email": "user1@example.com"
  }
};

var SUCCESS_RESP = {
  "success": true
};

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .put('/transactions/' + TXN_1.id + '/resend_request')
  .reply(200, function(uri, requestBody) {
    return SUCCESS_RESP;
  });

var COMPLETE_RESP = {
  "success": true,
  "transaction": {
    "id": "503c46a4f8182b10650000ad",
    "created_at": "2012-08-27T21:18:44-07:00",
    "notes": null,
    "amount": {
      "amount": "-1.10000000",
      "currency": "BTC"
    },
    "request": false,
    "status": "pending",
    "recipient": {
      "id": "503c46a3f8182b106500009c",
      "name": "New User",
      "email": "user2@example.com"
    },
    "sender": {
      "id": "503c46a2f8182b106500008a",
      "name": "New User",
      "email": "user1@example.com"
    }
  }
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .put('/transactions/' + TXN_1.id + '/complete_request')
  .reply(200, function(uri, requestBody) {
    return COMPLETE_RESP;
  });

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .put('/transactions/' + TXN_1.id + '/cancel_request')
  .reply(200, function(uri, requestBody) {
    return SUCCESS_RESP;
  });

module.exports.TXN_1             = TXN_1            ;
module.exports.TEST_BASE_URI     = TEST_BASE_URI    ;
module.exports.ACCOUNT_1         = ACCOUNT_1        ;
module.exports.SUCCESS_RESP      = SUCCESS_RESP     ;
module.exports.COMPLETE_RESP     = COMPLETE_RESP    ;

