/*jslint node: true */
/*jslint unparam: true */
/*jslint todo: true */

var nock     = require('nock');

var TEST_BASE_URI = 'http://mockapi.coinbase.com/v2/';
var ACCOUNT_1 = {
  "id": "1234",
  "resource": "account",
  "balance": {
    "amount":"0.07",
    "currency": "BTC"
  }
};
var ACCOUNT_2 = {
  "id": "5678",
  "resource": "account",
  "balance": {
    "amount":"1.08",
    "currency": "USD"
  }
};
var ACCOUNT_3 = { //gets deleted
  "id": "1000",
  "resource": "account",
  "balance": {
    "amount":"2.08",
    "currency": "USD"
  }
};
var EXPIRE_REGEX = /\?expire=[0-9]+/g;

var PRIMARY_RESPONSE = {
  'data' : ACCOUNT_1
};
nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post('/accounts/' + ACCOUNT_1.id + '/primary')
  .reply(200, PRIMARY_RESPONSE);

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .delete('/accounts/' + ACCOUNT_3.id)
  .reply(204, null);

var MODIFY_ACCOUNT_RESP = {
  "data": {
    "id": "53752d3e46cd93c93c00000c",
    "resource": "account",
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
    "data": [
      {
          "id": "123",
          "resource": "address",
          "address": "moLxGrqWNcnGq4A8Caq8EGP4n9GUGWanj4",
          "callback_url": null,
          "label": "My Label",
          "created_at": "2013-05-09T23:07:08-07:00"
      },
      {
          "id": "1234",
          "resource": "address",
          "address": "mwigfecvyG4MZjb6R5jMbmNcs7TkzhUaCj",
          "callback_url": null,
          "label": null,
          "created_at": "2013-05-09T17:50:37-07:00"
      },
      {
          "id": "12344",
          "resource": "address",
          "address": "2N139JFn7dwX1ySkdWYDXCV51oyBCuV8zYw",
          "callback_url": null,
          "label": null,
          "created_at": "2013-05-09T17:50:37-07:00",
          "type": "p2sh",
          "redeem_script": "524104c6e3f151b7d0ca7a63c6090c1eb86fd2cbfce43c367b5b36553ba28ade342b9dd8590f48abd48aa0160babcabfdccc6529609d2f295b3165e724de2f15adca9d410434cca255243e36de58f628b0f462518168b9c97b408f92ea9e01e168c70c003398bbf9b4c5cb9344f00c7cebf40322405f9b063eb4d2da25e710759aa51301eb4104624c024547a858b898bfe0b89c4281d743303da6d9ad5fc2f82228255586a9093011a540acae4bdf77ce427c0cb9b482918093e677238800fc0f6fae14f6712853ae"
      }
    ],
  };

nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g)
  .get('/accounts/' + ACCOUNT_1.id + '/addresses')
  .reply(200, function(uri, requestBody) {
    return GET_ADDRESSES_RESP;
  });

var GET_ADDRESS_RESP = {
  "data": {
    "id": "503c46a4f8182b10650000ad",
    "resource": "address",
    "address": "moLxGrqWNcnGq4A8Caq8EGP4n9GUGWanj4",
    "callback_url": null,
    "label": "My Label",
    "created_at": "2013-05-09T23:07:08-07:00"
  }
};

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .get('/accounts/' + ACCOUNT_1.id + '/addresses/moLxGrqWNcnGq4A8Caq8EGP4n9GUGWanj4')
  .reply(200, GET_ADDRESS_RESP);

var CREATE_ADDRESS_RESP = {
  "data": {
    "id"           : "hfiehr",
    "resource": "address",
    "address"      : "muVu2JZo8PbewBHRp6bpqFvVD87qvqEHWA",
    "callback_url" : "http: //www.example.com/callback",
    "label"        : "Dalmation donations"
  }
};

nock(TEST_BASE_URI)
  .filteringPath(EXPIRE_REGEX, '')
  .post('/accounts/' + ACCOUNT_1.id + '/addresses',
        {callback_url: 'http://www.example.com/callback',
         label: 'Dalmation donations'})
  .reply(201, function(uri, body) {
    return CREATE_ADDRESS_RESP;
  });


var GET_TRANSACTIONS_RESP ={
  "data": [
  {
  "id": "5018f833f8182b129c00002f",
  "resource": "transaction",
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
  },
  {
  "id": "5018f833f8182b129c00002e",
  "resource": "transaction",
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
  ],
};

nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/accounts/' + ACCOUNT_1.id + '/transactions')
  .reply(200, function(uri, requestBody) {
    return GET_TRANSACTIONS_RESP;
  });

var GET_TRANSACTION_RESP = {
    "data": {
      "id": "1234",
      "resource": "transaction",
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
  .get('/accounts/' + ACCOUNT_1.id + '/transactions/1234')
  .reply(200, function(uri, requestBody) {
    return GET_TRANSACTION_RESP;
  });

var TRANSFER_MONEY_RESP = {
  "data": {
  "id": "5480cc82dddd20de7b000033",
  "resource": "transaction",
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
  .post('/accounts/' + ACCOUNT_1.id + '/transactions',
        {"to": "5011f33df8182b142400000a",
         "amount": "1.234",
         "notes": "Sample transaction for you",
         "type": "transfer"})
  .reply(201, function(uri, body) {
    return TRANSFER_MONEY_RESP;
  });

var SEND_MONEY_RESP = {
  "data": {
  "id": "501a1791f8182b2071000087",
  "resource": "transaction",
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
  .post('/accounts/' + ACCOUNT_1.id + '/transactions',
        {"to": "user1@example.com",
         "amount": "1.234",
         "notes": "Sample transaction for you",
         "type": "send"})
  .reply(201, function(uri, body) {
    return SEND_MONEY_RESP;
  });

var REQUEST_MONEY_RESP = {
  "data": {
  "id": "501a3554f8182b2754000003",
  "resource": "transaction",
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
  .post('/accounts/' + ACCOUNT_1.id + '/transactions',
        {"from": "user1@example.com",
         "amount": "1.234",
         "notes": "Sample transaction for you",
         "type": "request"})
  .reply(201, function(uri, body) {
    return REQUEST_MONEY_RESP;
  });

var GET_BUYS_RESP = {
  "data": [
  {
  "id": "544047e346cd9333bd000066",
  "resource": "buy",
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
  ],
};

nock(TEST_BASE_URI)
  .filteringPath(/expire=[0-9]+/g, 'expire=XXX')
  .get('/accounts/' + ACCOUNT_1.id + '/buys')
  .reply(200, function(uri, requestBody) {
    return GET_BUYS_RESP;
  });

var BUY_RESP = {
  "data": {
  "id": "5456c2cb46cd93593d00000b",
  "resource": "buy",
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
  .post('/accounts/' + ACCOUNT_1.id + '/buys')
  .reply(201, function(uri, body) {
    return BUY_RESP;
  });

module.exports.GET_ADDRESSES_RESP   = GET_ADDRESSES_RESP   ;
module.exports.GET_ADDRESS_RESP     = GET_ADDRESS_RESP     ;
module.exports.CREATE_ADDRESS_RESP  = CREATE_ADDRESS_RESP  ;
module.exports.GET_TRANSACTIONS_RESP= GET_TRANSACTIONS_RESP;
module.exports.GET_TRANSACTION_RESP = GET_TRANSACTION_RESP ;
module.exports.TRANSFER_MONEY_RESP  = TRANSFER_MONEY_RESP  ;
module.exports.SEND_MONEY_RESP      = SEND_MONEY_RESP      ;
module.exports.REQUEST_MONEY_RESP   = REQUEST_MONEY_RESP   ;
module.exports.GET_BUYS_RESP        = GET_BUYS_RESP        ;
module.exports.BUY_RESP             = BUY_RESP             ;
module.exports.TEST_BASE_URI        = TEST_BASE_URI        ;
module.exports.ACCOUNT_1            = ACCOUNT_1            ;
module.exports.ACCOUNT_2            = ACCOUNT_2            ;
module.exports.ACCOUNT_3            = ACCOUNT_3            ;
module.exports.MODIFY_ACCOUNT_RESP  = MODIFY_ACCOUNT_RESP  ;

