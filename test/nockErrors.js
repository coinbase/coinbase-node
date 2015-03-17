/*jslint node: true */
/*jslint unparam: true */

var nock     = require('nock');

var EXPIRE_REGEX = /\?expire=[0-9]+/g;
var TEST_BASE_URI = 'http://mockapi.coinbase.com/v1/';
var ACCOUNT_1 = {
  "id": "E1234",
  "balance": {
    "amount":"0.07",
    "currency": "BTC"
  }
};

var TXN_2 = {
  "id": "T1234XXX2",
};
var TXN_3 = {
  "id": "T1234XXX3",
};
var TXN_4 = {
  "id": "T1234XXX4",
};
var TXN_5 = {
  "id": "T1234XXX5",
};
var TXN_6 = {
  "id": "T1234XXX6",
};
var TXN_1 = {
  "id": "ET1234",
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

var FAILURE = {
  "success": false,
};
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
  .reply(402, function(uri, requestBody) {
    return COMPLETE_RESP;
  });

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .put('/transactions/' + TXN_2.id + '/complete_request')
  .reply(401, COMPLETE_RESP, {
    "www-authenticate": "Bearer realm=\"Doorkeeper\", error=\"invalid_token\", error_description=\"The access token is invalid\"",
            "x-ua-compatible": "IE=Edge,chrome=1",
            "x-request-id": "9d82727a-43dd-4cb3-a80e-a3deb4874702",
            "x-rack-cache": "miss",
            "expires": "Sat, 01 Jan 2000 00:00:00 GMT",
            "x-powered-by": "Proof-of-Work",
            "vary": "Accept-Encoding",
            "via": "1.1 vegur",
            "cf-ray": "1bb4ec07fbfb11f5-SJC"
  });

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .put('/transactions/' + TXN_3.id + '/complete_request')
  .reply(401, COMPLETE_RESP, {
    "www-authenticate": "Bearer realm=\"Doorkeeper\", error=\"invalid_token\", error_description=\"The access token is expired!\"",
            "x-ua-compatible": "IE=Edge,chrome=1",
            "x-request-id": "9d82727a-43dd-4cb3-a80e-a3deb4874702",
            "x-rack-cache": "miss",
            "expires": "Sat, 01 Jan 2000 00:00:00 GMT",
            "x-powered-by": "Proof-of-Work",
            "vary": "Accept-Encoding",
            "via": "1.1 vegur",
            "cf-ray": "1bb4ec07fbfb11f5-SJC"
  });

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .put('/transactions/' + TXN_4.id + '/complete_request')
  .reply(401, COMPLETE_RESP, {
    "www-authenticate": "Bearer realm=\"Doorkeeper\", error=\"some_other_error\", error_description=\"The access token is nonesense!\"",
            "x-ua-compatible": "IE=Edge,chrome=1",
            "x-request-id": "9d82727a-43dd-4cb3-a80e-a3deb4874702",
            "x-rack-cache": "miss",
            "expires": "Sat, 01 Jan 2000 00:00:00 GMT",
            "x-powered-by": "Proof-of-Work",
            "vary": "Accept-Encoding",
            "via": "1.1 vegur",
            "cf-ray": "1bb4ec07fbfb11f5-SJC"
  });

module.exports.TXN_1             = TXN_1            ;
module.exports.TXN_2             = TXN_2            ;
module.exports.TXN_3             = TXN_3            ;
module.exports.TXN_4             = TXN_4            ;
module.exports.TXN_5             = TXN_5            ;
module.exports.TXN_6             = TXN_6            ;
module.exports.TEST_BASE_URI     = TEST_BASE_URI    ;
module.exports.ACCOUNT_1         = ACCOUNT_1        ;
module.exports.COMPLETE_RESP     = COMPLETE_RESP    ;
module.exports.FAILURE           = FAILURE          ;

