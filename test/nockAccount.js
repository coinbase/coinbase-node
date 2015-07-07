/*jslint node: true */
/*jslint unparam: true */
/*jslint todo: true */

var nock     = require('nock');

var TEST_BASE_URI = 'http://mockapi.coinbase.com/v1/';
var ACCOUNT_1 = {
  "id": "1234",
  "balance": {
    "amount":"0.07",
    "currency": "BTC"
  }
};
var ACCOUNT_2 = {
  "id": "5678",
  "balance": {
    "amount":"1.08",
    "currency": "USD"
  }
};
var ACCOUNT_3 = { //gets deleted
  "id": "1000",
  "balance": {
    "amount":"2.08",
    "currency": "USD"
  }
};
var SUCCESS_TRUE_RESPONSE = { "success": true };
var EXPIRE_REGEX = /\?expire=[0-9]+/g;

var GET_BAL_RESP_1 = ACCOUNT_1.balance;
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .get('/accounts/' + ACCOUNT_1.id + '/balance')
  .reply(200, GET_BAL_RESP_1);

var GET_BAL_RESP_2 = ACCOUNT_2.balance;
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .get('/accounts/' + ACCOUNT_2.id + '/balance')
  .reply(200, GET_BAL_RESP_2);

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post('/accounts/' + ACCOUNT_1.id + '/primary')
  .reply(200, SUCCESS_TRUE_RESPONSE);

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .delete('/accounts/' + ACCOUNT_3.id)
  .reply(200, SUCCESS_TRUE_RESPONSE);

var MODIFY_ACCOUNT_RESP = {
  "success": true,
  "account": {
  "id": "53752d3e46cd93c93c00000c",
  "name": "Satoshi Wallet",
  "active": true,
  "created_at": "2014-05-15T14:10:22-07:00",
  "balance": {
  "amount": "100.00",
  "currency": "GBP"
  },
  "native_balance": {
  "amount": "168.14",
  "currency": "USD"
  },
  "primary": false
  }
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .put('/accounts/' + ACCOUNT_1.id)
  .reply(200, function(uri, body) {
    return MODIFY_ACCOUNT_RESP;
  });

var GET_ADDRESSES_RESP =
  {
    "addresses": [
      {
        "address": {
          "address": "moLxGrqWNcnGq4A8Caq8EGP4n9GUGWanj4",
          "callback_url": null,
          "label": "My Label",
          "created_at": "2013-05-09T23:07:08-07:00"
        }
      },
      {
        "address": {
          "address": "mwigfecvyG4MZjb6R5jMbmNcs7TkzhUaCj",
          "callback_url": null,
          "label": null,
          "created_at": "2013-05-09T17:50:37-07:00"
        }
      },
      {
        "address": {
          "address": "2N139JFn7dwX1ySkdWYDXCV51oyBCuV8zYw",
          "callback_url": null,
          "label": null,
          "created_at": "2013-05-09T17:50:37-07:00",
          "type": "p2sh",
          "redeem_script": "524104c6e3f151b7d0ca7a63c6090c1eb86fd2cbfce43c367b5b36553ba28ade342b9dd8590f48abd48aa0160babcabfdccc6529609d2f295b3165e724de2f15adca9d410434cca255243e36de58f628b0f462518168b9c97b408f92ea9e01e168c70c003398bbf9b4c5cb9344f00c7cebf40322405f9b063eb4d2da25e710759aa51301eb4104624c024547a858b898bfe0b89c4281d743303da6d9ad5fc2f82228255586a9093011a540acae4bdf77ce427c0cb9b482918093e677238800fc0f6fae14f6712853ae"
        }
      }
    ],
    "total_count": 3,
    "num_pages": 1,
    "current_page": 1
  };

nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/addresses?account_id=' + ACCOUNT_1.id + '&expire=XXX')
  .reply(200, function(uri, requestBody) {
    return GET_ADDRESSES_RESP;
  });

//TODO: this doesn't work in production
nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/addresses?account_id=' + ACCOUNT_1.id + '&page=1&query=moLxGrqWNcnGq4A8Caq8EGP4n9GUGWanj4&expire=XXX')
  .reply(200, function(uri, requestBody) {
    return GET_ADDRESSES_RESP;
  });

var GET_ADDRESS_RESP = {
  "address": {
    "id": "503c46a4f8182b10650000ad",
    "address": "moLxGrqWNcnGq4A8Caq8EGP4n9GUGWanj4",
    "callback_url": null,
    "label": "My Label",
    "created_at": "2013-05-09T23:07:08-07:00"
  }
};

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .get('/accounts/' + ACCOUNT_1.id + '/address')
  .reply(200, GET_ADDRESS_RESP);

var CREATE_ADDRESS_RESP = {
    "success"      : true,
    "address"      : "muVu2JZo8PbewBHRp6bpqFvVD87qvqEHWA",
    "callback_url" : "http: //www.example.com/callback",
    "label"        : "Dalmation donations"
};

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post('/accounts/' + ACCOUNT_1.id + '/address')
  .reply(200, function(uri, body) {
    return CREATE_ADDRESS_RESP;
  });


var GET_TRANSACTIONS_RESP ={
  "current_user": {
  "id": "5011f33df8182b142400000e",
  "email": "user2@example.com",
  "name": "User Two"
  },
  "balance": {
  "amount": "50.00000000",
  "currency": "BTC"
  },
  "native_balance": {
  "amount": "500.00",
  "currency": "USD"
  },
  "transactions": [
  {
  "transaction": {
  "id": "5018f833f8182b129c00002f",
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
  }
  },
  {
  "transaction": {
  "id": "5018f833f8182b129c00002e",
  "created_at": "2012-08-01T02:36:43-07:00",
  "hsh": "9d6a7d1112c3db9de5315b421a5153d71413f5f752aff75bf504b77df4e646a3",
  "amount": {
  "amount": "-1.00000000",
  "currency": "BTC"
  },
  "request": false,
  "status": "complete",
  "sender": {
  "id": "5011f33df8182b142400000e",
  "name": "User Two",
  "email": "user2@example.com"
  },
  "recipient_address": "37muSN5ZrukVTvyVh3mT5Zc5ew9L9CBare"
  }
  }
  ],
  "total_count": 2,
  "num_pages": 1,
  "current_page": 1
};

nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/transactions?account_id=' + ACCOUNT_1.id + '&expire=XXX')
  .reply(200, function(uri, requestBody) {
    return GET_TRANSACTIONS_RESP;
  });

var GET_TRANSACTION_RESP = {
    "transaction": {
      "id": "1234",
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
    }
};

nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/transactions/1234?account_id=' + ACCOUNT_1.id + '&expire=XXX')
  .reply(200, function(uri, requestBody) {
    return GET_TRANSACTION_RESP;
  });

var TRANSFER_MONEY_RESP = {
  "success": true,
  "transaction": {
  "id": "5480cc82dddd20de7b000033",
  "created_at": "2014-12-04T13:05:06-08:00",
  "hsh": null,
  "amount": {
  "amount": "-1.23400000",
  "currency": "BTC"
  },
  "request": false,
  "status": "pending",
  "sender": {
  "id": "54738c8ea54d75d167000005",
  "email": "user1@example.com",
  "name": "User One",
  "avatar_url": "https://secure.gravatar.com/avatar/111d68d06e2d317b5a59c2c6c5bad808.png?d=https://www.coinbase.com/assets/avatar.png&r=R"
  },
  "recipient": {
  "id": "54738c8ea54d75d167000005",
  "email": "user1@example.com",
  "name": "User One",
  "avatar_url": "https://secure.gravatar.com/avatar/111d68d06e2d317b5a59c2c6c5bad808.png?d=https://www.coinbase.com/assets/avatar.png&r=R"
  },
  "notes": "Sample transaction for you",
  "idem": ""
  }
};

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post('/transactions/transfer_money')
  .reply(200, function(uri, body) {
    var txn = JSON.parse(body);
    if (txn.account_id === ACCOUNT_1.id) {
      return TRANSFER_MONEY_RESP;
    }
    return null;
  });

var SEND_MONEY_RESP = {
  "success": true,
  //"error": "testme",
  "transaction": {
  "id": "501a1791f8182b2071000087",
  "created_at": "2012-08-01T23:00:49-07:00",
  "hsh": "9d6a7d1112c3db9de5315b421a5153d71413f5f752aff75bf504b77df4e646a3",
  "notes": "Sample transaction for you!",
  "idem": "",
  "amount": {
  "amount": "-1.23400000",
  "currency": "BTC"
  },
  "request": false,
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
  },
  "recipient_address": "37muSN5ZrukVTvyVh3mT5Zc5ew9L9CBare"
  }
};

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post('/transactions/send_money')
  .reply(200, function(uri, body) {
    var txn = JSON.parse(body);
    if (txn.account_id === ACCOUNT_1.id) {
      return SEND_MONEY_RESP;
    }
    return null;
  });

var REQUEST_MONEY_RESP = {
  "success": true,
  "transaction": {
  "id": "501a3554f8182b2754000003",
  "created_at": "2012-08-02T01:07:48-07:00",
  "hsh": null,
  "notes": "Sample request for you!",
  "amount": {
  "amount": "1.23400000",
  "currency": "BTC"
  },
  "request": true,
  "status": "pending",
  "sender": {
  "id": "5011f33df8182b142400000a",
  "name": "User One",
  "email": "user1@example.com"
  },
  "recipient": {
  "id": "5011f33df8182b142400000e",
  "name": "User Two",
  "email": "user2@example.com"
  }
  }
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post('/transactions/request_money')
  .reply(200, function(uri, body) {
    var txn = JSON.parse(body);
    if (txn.account_id === ACCOUNT_1.id) {
      return REQUEST_MONEY_RESP;
    }
    return null;
  });

var GET_TRANSFERS_RESP = {
  "transfers": [
  {
  "transfer": {
  "id": "544047e346cd9333bd000066",
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
  }
  }
  ],
  "total_count": 1,
  "num_pages": 1,
  "current_page": 1
};

nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/transfers?account_id=' + ACCOUNT_1.id + '&expire=XXX')
  .reply(200, function(uri, requestBody) {
    return GET_TRANSFERS_RESP;
  });

var GET_TRANSFER_RESP = {
  "transfer": {
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
  }
};
nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/transfers/9901234?account_id=' + ACCOUNT_1.id + '&expire=XXX')
  .reply(200, function(uri, requestBody) {
    return GET_TRANSFER_RESP;
  });

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

var CREATE_BUTTON_RESP = {
  "success": true,
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
  .post('/buttons')
  .reply(200, function(uri, body) {
    var txn = JSON.parse(body);
    if (txn.account_id === ACCOUNT_1.id) {
      return CREATE_BUTTON_RESP;
    }
    return null;
  });

var GET_ORDERS_RESP = {
  "orders": [
  {
  "order": {
  "id": "A7C52JQT",
  "created_at": "2013-03-11T22:04:37-07:00",
  "status": "completed",
  "total_btc": {
  "cents": 100000000,
  "currency_iso": "BTC"
  },
  "total_native": {
  "cents": 3000,
  "currency_iso": "USD"
  },
  "custom": "",
  "receive_address": "mgrmKftH5CeuFBU3THLWuTNKaZoCGJU5jQ",
  "button": {
  "type": "buy_now",
  "name": "Order #1234",
  "description": "order description",
  "id": "eec6d08e9e215195a471eae432a49fc7"
  },
  "transaction": {
  "id": "513eb768f12a9cf27400000b",
  "hash": "4cc5eec20cd692f3cdb7fc264a0e1d78b9a7e3d7b862dec1e39cf7e37ababc14",
  "confirmations": 0
  }
  }
  }
  ],
  "total_count": 1,
  "num_pages": 1,
  "current_page": 1
};
nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/orders?account_id=' + ACCOUNT_1.id + '&expire=XXX')
  .reply(200, function(uri, requestBody) {
    return GET_ORDERS_RESP;
  });

var GET_ORDER_RESP = {
  "order": {
  "id": "A7C52JQT",
  "created_at": "2013-03-11T22:04:37-07:00",
  "status": "completed",
  "total_btc": {
  "cents": 10000000,
  "currency_iso": "BTC"
  },
  "total_native": {
  "cents": 10000000,
  "currency_iso": "BTC"
  },
  "custom": "custom123",
  "receive_address": "mgrmKftH5CeuFBU3THLWuTNKaZoCGJU5jQ",
  "button": {
  "type": "buy_now",
  "name": "test",
  "description": "",
  "id": "eec6d08e9e215195a471eae432a49fc7"
  },
  "transaction": {
  "id": "513eb768f12a9cf27400000b",
  "hash": "4cc5eec20cd692f3cdb7fc264a0e1d78b9a7e3d7b862dec1e39cf7e37ababc14",
  "confirmations": 0
  }
  }
};
nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/orders/A9901234?account_id=' + ACCOUNT_1.id + '&expire=XXX')
  .reply(200, function(uri, requestBody) {
    return GET_ORDER_RESP;
  });

var CREATE_ORDER_RESP = {
  "success": true,
  "order": {
    "id": "8QNULQFE",
    "created_at": "2014-02-04T23:36:30-08:00",
    "status": "new",
    "total_btc": {
      "cents": 12300000,
      "currency_iso": "BTC"
    },
    "total_native": {
      "cents": 123,
      "currency_iso": "USD"
    },
    "custom": null,
    "receive_address": "mnskjZs57dBAmeU2n4csiRKoQcGRF4tpxH",
    "button": {
      "type": "buy_now",
      "name": "test",
      "description": null,
      "id": "1741b3be1eb5dc50625c48851a94ae13"
    },
    "transaction": null
  }
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post('/orders')
  .reply(200, function(uri, body) {
    var obj = JSON.parse(body);
    if (obj.account_id === ACCOUNT_1.id &&
        obj.button.price_string === "1.23") {
      return CREATE_ORDER_RESP;
    }
    return null;
  });

var BUY_RESP = {
  "success": true,
  "transfer": {
  "id": "5456c2cb46cd93593d00000b",
  "type": "Buy",
  "code": "5456c2cb46cd93593d00000b",
  "created_at": "2013-01-28T16:08:58-08:00",
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
  "status": "Created",
  "payout_date": "2013-02-01T18:00:00-08:00",
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
  }
  }
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post('/buys')
  .reply(200, function(uri, body) {
    var obj = JSON.parse(body);
    if (obj.account_id === ACCOUNT_1.id &&
        obj.qty === "100") {
      return BUY_RESP;
    }
    return null;
  });

var SELL_RESP = {
  "success": true,
  //"success": false,
  //"error": 'my error !',
  //"errors": ["error1", {"error2": "bad"}],
  "transfer": {
  "id": "5456c2cb46cd93593d00000b",
  "type": "Sell",
  "code": "5456c2cb46cd93593d00000b",
  "created_at": "2013-01-28T16:32:35-08:00",
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
  "status": "Created",
  "payout_date": "2013-02-01T18:00:00-08:00",
  "btc": {
  "amount": "1.00000000",
  "currency": "BTC"
  },
  "subtotal": {
  "amount": "13.50",
  "currency": "USD"
  },
  "total": {
  "amount": "13.21",
  "currency": "USD"
  }
  }
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post('/sells')
  .reply(200, function(uri, body) {
    var obj = JSON.parse(body);
    if (obj.account_id === ACCOUNT_1.id &&
        obj.qty === "12") {
      return SELL_RESP;
    }
    return null;
  });

module.exports.SUCCESS_TRUE_RESPONSE= SUCCESS_TRUE_RESPONSE;
module.exports.GET_BAL_RESP_1       = GET_BAL_RESP_1       ;
module.exports.GET_BAL_RESP_2       = GET_BAL_RESP_2       ;
module.exports.GET_ADDRESSES_RESP   = GET_ADDRESSES_RESP   ;
module.exports.GET_ADDRESS_RESP     = GET_ADDRESS_RESP     ;
module.exports.CREATE_ADDRESS_RESP  = CREATE_ADDRESS_RESP  ;
module.exports.GET_TRANSACTIONS_RESP= GET_TRANSACTIONS_RESP;
module.exports.GET_TRANSACTION_RESP = GET_TRANSACTION_RESP ;
module.exports.TRANSFER_MONEY_RESP  = TRANSFER_MONEY_RESP  ;
module.exports.SEND_MONEY_RESP      = SEND_MONEY_RESP      ;
module.exports.REQUEST_MONEY_RESP   = REQUEST_MONEY_RESP   ;
module.exports.GET_TRANSFERS_RESP   = GET_TRANSFERS_RESP   ;
module.exports.GET_TRANSFER_RESP    = GET_TRANSFER_RESP    ;
module.exports.GET_BUTTON_RESP      = GET_BUTTON_RESP      ;
module.exports.CREATE_BUTTON_RESP   = CREATE_BUTTON_RESP   ;
module.exports.GET_ORDERS_RESP      = GET_ORDERS_RESP      ;
module.exports.GET_ORDER_RESP       = GET_ORDER_RESP       ;
module.exports.CREATE_ORDER_RESP    = CREATE_ORDER_RESP    ;
module.exports.BUY_RESP             = BUY_RESP             ;
module.exports.SELL_RESP            = SELL_RESP            ;
module.exports.TEST_BASE_URI        = TEST_BASE_URI        ;
module.exports.ACCOUNT_1            = ACCOUNT_1            ;
module.exports.ACCOUNT_2            = ACCOUNT_2            ;
module.exports.ACCOUNT_3            = ACCOUNT_3            ;
module.exports.MODIFY_ACCOUNT_RESP  = MODIFY_ACCOUNT_RESP  ;

