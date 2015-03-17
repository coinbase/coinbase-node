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

var GET_BUTTON_RESP = {
  "button": {
    "code": "93865b9cae83706ae59220c013bc0afd",
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
  .get('/buttons/' + GET_BUTTON_RESP.button.code)
  .reply(200, function(uri, requestBody) {
    return GET_BUTTON_RESP;
  });

var GET_ORDERS_RESP = {
  "orders": [
    {
      "order": {
        "id": "7RTTRDVP",
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
    }
  ],
  "total_count": 1,
  "num_pages": 1,
  "current_page": 1,
};

var buttonOrdersPath = '/buttons/' + GET_BUTTON_RESP.button.code +
      '/orders?account_id=' + ACCOUNT_1.id + '&expire=XXX';
nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get(buttonOrdersPath)
  .reply(200, function(uri, body) {
    return GET_ORDERS_RESP;
  });

//setup another
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .get('/buttons/' + GET_BUTTON_RESP.button.code)
  .reply(200, function(uri, requestBody) {
    return GET_BUTTON_RESP;
  });

var CREATE_ORDER_RESP = {
  "success": true,
  "order": {
  "id": "7RTTRDVP",
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

var buttonCreatePath = '/buttons/' + GET_BUTTON_RESP.button.code +
      '/create_order';
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post(buttonCreatePath)
  .reply(200, function(uri, body) {
    return CREATE_ORDER_RESP;
  });

module.exports.TEST_BASE_URI     = TEST_BASE_URI    ;
module.exports.ACCOUNT_1         = ACCOUNT_1        ;
module.exports.GET_BUTTON_RESP   = GET_BUTTON_RESP  ;
module.exports.GET_ORDERS_RESP   = GET_ORDERS_RESP  ;
module.exports.CREATE_ORDER_RESP = CREATE_ORDER_RESP;

