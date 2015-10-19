/*jslint node: true */
/*jslint unparam: true */

var nock     = require('nock');

var EXPIRE_REGEX = /\?expire=[0-9]+/g;

var TEST_BASE_URI = 'http://mockapi.coinbase.com/v2/';
var ACCOUNT_1 = {
  "id": "1234",
  "balance": {
    "amount":"0.07",
    "currency": "BTC"
  }
};

var GET_CHECKOUT_RESP = {
  "data": {
    "id": "93865b9cae83706ae59220c013bc0afd",
    "resource": "checkout",
    "type": "buy_now",
    "subscription": false,
    "style": "custom_large",
    "text": "Pay With Bitcoin",
    "name": "test",
    "description": "Sample description",
    "custom": "Order123",
    "callback_url": "http://www.example.com/my_custom_button_callback",
    "price": {
      "cents": 123,
      "currency_iso": "USD"
    }
  }
};

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .get('/checkouts/' + GET_CHECKOUT_RESP.data.code)
  .reply(200, function(uri, requestBody) {
    return GET_CHECKOUT_RESP;
  });

var GET_ORDERS_RESP = {
  "data": [
    {
        "id": "7RTTRDVP",
        "resource": "order",
        "created_at": "2013-11-09T22:47:10-08:00",
        "status": "new",
        "total_btc": {
        "cents": 100000000,
        "currency_iso": "BTC"
        },
        "total_native": {
        "cents": 100000000,
        "currency_iso": "BTC"
        },
        "custom": "Order123",
        "receive_address": "mgrmKftH5CeuFBU3THLWuTNKaZoCGJU5jQ",
        "button": {
        "type": "buy_now",
        "name": "test",
        "description": "Sample description",
        "id": "93865b9cae83706ae59220c013bc0afd"
        },
        "transaction": null
    }
  ],
};

var buttonOrdersPath = '/checkouts/' + GET_CHECKOUT_RESP.data.id + '/orders';
nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get(buttonOrdersPath)
  .reply(200, function(uri, body) {
    return GET_ORDERS_RESP;
  });

//setup another
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .get('/checkouts/' + GET_CHECKOUT_RESP.data.id)
  .reply(200, function(uri, requestBody) {
    return GET_CHECKOUT_RESP;
  });

var CREATE_ORDER_RESP = {
  "data": {
  "id": "7RTTRDVP",
  "resource": "order",
  "created_at": "2013-11-09T22:47:10-08:00",
  "status": "new",
  "total_btc": {
  "cents": 100000000,
  "currency_iso": "BTC"
  },
  "total_native": {
  "cents": 3000,
  "currency_iso": "USD"
  },
  "custom": "Order123",
  "receive_address": "mgrmKftH5CeuFBU3THLWuTNKaZoCGJU5jQ",
  "button": {
  "type": "buy_now",
  "name": "test",
  "description": "Sample description",
  "id": "93865b9cae83706ae59220c013bc0afd"
  },
  "transaction": null
  }
};

var buttonCreatePath = '/checkouts/' + GET_CHECKOUT_RESP.data.id + '/orders';
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post(buttonCreatePath)
  .reply(200, function(uri, body) {
    return CREATE_ORDER_RESP;
  });

module.exports.TEST_BASE_URI     = TEST_BASE_URI    ;
module.exports.ACCOUNT_1         = ACCOUNT_1        ;
module.exports.GET_CHECKOUT_RESP = GET_CHECKOUT_RESP;
module.exports.GET_ORDERS_RESP   = GET_ORDERS_RESP  ;
module.exports.CREATE_ORDER_RESP = CREATE_ORDER_RESP;

