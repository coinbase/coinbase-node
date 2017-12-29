/*jslint node: true */
/*jslint unparam: true */

var nock     = require('nock');

var EXPIRE_REGEX = /\?expire=[0-9]+/g;

var TEST_BASE_URI = 'http://mockapi.coinbase.com/v2/';

var CREATE_DEPOSIT_RESP = {
  "data": {
    "id": "67e0eaec-07d7-54c4-a72c-2e92826897df",
    "status": "created",
    "payment_method": {
      "id": "83562370-3e5c-51db-87da-752af5ab9559",
      "resource": "payment_method",
      "resource_path": "/v2/payment-methods/83562370-3e5c-51db-87da-752af5ab9559"
    },
    "transaction": {
      "id": "441b9494-b3f0-5b98-b9b0-4d82c21c252a",
      "resource": "transaction",
      "resource_path": "/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/441b9494-b3f0-5b98-b9b0-4d82c21c252a"
    },
    "amount": {
      "amount": "10.00",
      "currency": "USD"
    },
    "subtotal": {
      "amount": "10.00",
      "currency": "USD"
    },
    "created_at": "2015-01-31T20:49:02Z",
    "updated_at": "2015-02-11T16:54:02-08:00",
    "resource": "deposit",
    "resource_path": "/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/deposits/67e0eaec-07d7-54c4-a72c-2e92826897df",
    "committed": true,
    "fee": {
      "amount": "0.00",
      "currency": "USD"
    },
    "payout_at": "2015-02-18T16:54:00-08:00"
  }
}

const deposit_uri = '/accounts/' + CREATE_DEPOSIT_RESP.data.id + '/deposits';

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post(deposit_uri)
  .reply(200, function(uri, requestBody) {
    return CREATE_DEPOSIT_RESP;
  });

module.exports.TEST_BASE_URI     = TEST_BASE_URI    ;
module.exports.CREATE_DEPOSIT_RESP = CREATE_DEPOSIT_RESP;

