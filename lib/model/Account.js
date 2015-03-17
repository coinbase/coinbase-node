//
// The Account object is the primary abstraction to the Conbase API.
//
"use strict";
var AccountBase = require('./AccountBase'),
    handleError = require('../errorHandler').handleError,
    Transaction = require('./Transaction'),
    Button      = require('./Button'),
    Transfer    = require('./Transfer'),
    Order       = require('./Order'),
    _           = require('lodash');

//
// ##CONSTRUCTOR
//
// _args `client` and `data` are required_
//
//```
// var Account = require('coinbase').model.Account;
// var myAccount = new Account(client, {'id': 'A1234'});
//```
// _normally you will get account instances from `Account` methods on the `Client`
// but this constructor is useful if you already know the id of the account and
// wish to reduce calls to the remote API._
//
// - - -
function Account(client, data) {
  if (!(this instanceof Account)) {
    return new Account(client, data);
  }
  AccountBase.call(this, client, data);
}

Account.prototype = Object.create(AccountBase.prototype);

//## delete
// returns `err` if unsuccessful
//
//```
//myAccount.delete(function(err, result) {
//  if (err) {
//    //do something
//  }
//});
//```
//
// [See Coinbase delete-an-account API Documentation](https://developers.coinbase.com/api#delete-an-account)
// - - -
Account.prototype.delete = function(callback) {
  var path = "accounts/" + this.id;
  this.client._deleteHttp(path, callback);
};

//## setPrimary
// make this account primary
//
// returns `err` if unsuccessful
//
//```
//myAccount.setPrimary(function(err, result) {
//  if (err) {
//    //do something
//  }
//});
//```
//
// [See Coinbase set-account-as-primary API Documentation](https://developers.coinbase.com/api#set-account-as-primary)
// - - -
Account.prototype.setPrimary = function(callback) {
  var path = "accounts/" + this.id + "/primary";
  this.client._postHttp(path, null, callback);
};

//## modify
// change the name of this account
//
// returns a new updated `Account` instance
//
//```
//var args = {"name":"Killroy BTC"};
//myAccount.modify(args, function(err, modifiedAcct) {
//  if (err) {
//    //do something
//  } else {
//  // do something with the modified account object that reflects your change
//  }
//});
//```
//
// [See Coinbase modify-an-account API Documentation](https://developers.coinbase.com/api#modify-an-account)
// - - -
Account.prototype.modify = function(args, callback) {
  var self = this;
  var path = "accounts/" + this.id;
  var parms = {'account': args};
  this.client._putHttp(path, parms, function myPut(err, result) {
    if (err) {
      callback(err, null);
      return;
    }
    var account = new Account(self.client, result.account);
    callback(null, account);
  });
};

//## getBalance
// returns a balance:
//```
//{
//  "amount": "36.62800000",
//  "currency": "BTC"
//}
//```
//
// get the balance of this account
//
//```
//myAccount.getBalance(function(err, bal) {
//  // do something with my balance
//});
//```
//
// [See Coinbase get-account39s-balance API Documentation](https://developers.coinbase.com/api#get-account39s-balance)
// - - -
Account.prototype.getBalance = function(callback) {
  var path = "accounts/" + this.id + "/balance";
  this.client._getHttp(path, null, callback);
};

//## getAddress
// returns the address of this account.
//
//```
//myAccount.getAddress(function(err, address) {
//  // do something with my account adddress
//});
//```
//
// [See Coinbase get-account39s-bitcoin-address API Documentation](https://developers.coinbase.com/api#get-account39s-bitcoin-address)
// - - -
Account.prototype.getAddress = function(callback) {
  var path = "accounts/" + this.id + "/address";
  this.client._getHttp(path, null, callback);
};

//## getAddresses
// returns an array of addresses associated with this account.
//
//```
//myAccount.getAddresses(1, 25, null, function(err, addresses) {
//  // do something with the array of adddresses
//});
//```
//
// _args `page` and `limit` optional but recommended.  If you request
// page 1 of size 10 and get an array of size 10, you should request page
// 2 next.  If page 2 returns 3 items or any count smaller than `limit`, you
// have all the results._
//
// _The query arg is optional.  see the API doc for more information to filter
// the results of this call._
//
// [See Coinbase list-bitcoin-addresses API Documentation](https://developers.coinbase.com/api#list-bitcoin-addresses)
// - - -
Account.prototype.getAddresses = function(page, limit, query, callback) {
  var path = "addresses";
  var args = {"account_id": this.id};
  if (page) {args.page = page;}
  if (limit) {args.limit = limit;}
  if (query) {args.query = query;}
  this.client._getHttp(path, args, callback);
};

//## createAddress
// returns a new Address object
//
// _input args are callback_url and label_
//```
//var args = {
//  "callback_url": "http://www.example.com/callback",
//  "label": "Dalmation donations"
//};
//myAccount.createAddress(args, function(err, address) {
//  do something with the address
//});
//```
//
// [See Coinbase create-a-new-bitcoin-address-for-an-account API Documentation](https://developers.coinbase.com/api#create-a-new-bitcoin-address-for-an-account)
// - - -
Account.prototype.createAddress = function(args, callback) {
  var path = "accounts/" + this.id + "/address";
  this.client._postHttp(path, {"address": args}, callback);
};

//## getTransactions
// returns an array of transactions associated with this account.
//
//```
//myAccount.getTransactions(1, 25, null, function(err, txns) {
//  // do something with the array of transactions
//});
//```
//
// _args `page` and `limit` optional but recommended.  If you request
// page 1 of size 10 and get an array of size 10, you should request page
// 2 next.  If page 2 returns 3 items or any count smaller than `limit`, you
// have all the results._
//
// [See Coinbase list-transactions API Documentation](https://developers.coinbase.com/api#list-transactions)
// - - -
Account.prototype.getTransactions = function(page, limit, callback) {

  var opts = {
    'colName'  : 'transactions',
    'typeName' : 'transaction',
    'ObjFunc'  : Transaction,
    'page'     : page,
    'limit'    : limit
  };

  this._getAll(opts, callback);
};

//## getTransaction
// returns the transaction associated with `transaction_id`
//
//```
//myAccount.getTransaction('T1233', function(err, txn) {
//  // do something with the txn
//});
//```
//
// [See Coinbase show-a-transaction API Documentation](https://developers.coinbase.com/api#show-a-transaction)
// - - -
Account.prototype.getTransaction = function(transaction_id, callback) {

  var opts = {
    'colName': 'transactions',
    'typeName': 'transaction',
    'ObjFunc': Transaction,
    'id':transaction_id
  };

  this._getOne(opts, callback);
};

//## transferMoney
// returns the transaction associated with the transfer between accounts.
//
//```
//var args = {
//            "to"     : "5011f33df8182b142400000a",
//            "amount" : "1.234",
//            "notes"  : "Sample transaction for you"
//          };
//myAccount.transferMoney(args, function(err, txn) {
//  // do something with the txn
//});
//```
//
// [See Coinbase transfer-money-between-accounts API Documentation](https://developers.coinbase.com/api#transfer-money-between-accounts)
// - - -
Account.prototype.transferMoney = function(args, callback) {
  this._initTxn('transfer_money', args, callback);
};

//## sendMoney
// returns the transaction associated with the sending of money
//
//```
//var args = {
//            "to"     : "user1@example.com",
//            "amount" : "1.234",
//            "notes"  : "Sample transaction for you"
//          };
//myAccount.sendMoney(args, function(err, txn) {
//  // do something with the txn
//});
//```
//
// [See Coinbase send-money API Documentation](https://developers.coinbase.com/api#send-money)
// - - -
Account.prototype.sendMoney = function(args, callback, twoFactorAuth) {

  var tfa = !twoFactorAuth
    ? null
    : {'CB-2FA-Token': twoFactorAuth};

  this._initTxn('send_money', args, callback, tfa);
};

//## requestMoney
// returns the transaction associated with the sending of money
//
//```
//var args = {
//            "from"   : "user1@example.com",
//            "amount" : "1.234",
//            "notes"  : "Sample transaction for you"
//          };
//myAccount.requestMoney(args, function(err, txn) {
//  // do something with the txn
//});
//```
//
// [See Coinbase request-bitcoin API Documentation](https://developers.coinbase.com/api#request-bitcoin)
// - - -
Account.prototype.requestMoney = function(args, callback) {
  this._initTxn('request_money', args, callback);
};

//## getTransfers
// returns an array of transfers associated with this account.
//
//```
//myAccount.getTransfers(1, 25, null, function(err, transfers) {
//  // do something with the array of transfers
//});
//```
//
// _args `page` and `limit` optional but recommended.  If you request
// page 1 of size 10 and get an array of size 10, you should request page
// 2 next.  If page 2 returns 3 items or any count smaller than `limit`, you
// have all the results._
//
// [See Coinbase list-buy-and-sell-history API Documentation](https://developers.coinbase.com/api#list-buy-and-sell-history)
// - - -
Account.prototype.getTransfers = function(page, limit, callback) {

  var opts = {
    'colName'  : 'transfers',
    'typeName' : 'transfer',
    'ObjFunc'  : Transfer,
    'page'     : page,
    'limit'    : limit
  };

  this._getAll(opts, callback);
};

//## getTransfer
// returns the transfer associated with `transfer_id`
//
//```
//myAccount.getTransfer('T1233', function(err, xfer) {
//  // do something with the transfer
//});
//```
//
// [See Coinbase show-a-transfer API Documentation](https://developers.coinbase.com/api#show-a-transfer)
// - - -
Account.prototype.getTransfer = function(transfer_id, callback) {

  var opts = {
    'colName'  : 'transfers',
    'typeName' : 'transfer',
    'ObjFunc'  : Transfer,
    'id'       : transfer_id
  };

  this._getOne(opts, callback);
};

//## getButton
// returns the `Button` associated with `code_or_custom` arg.
//
//```
//myAccount.getButton('B1233', function(err, button) {
//  // do something with the button
//});
//```
//
// [See Coinbase show-a-button API Documentation](https://developers.coinbase.com/api#show-a-button)
// - - -
Account.prototype.getButton = function(code_or_custom, callback) {
  var self = this;
  var path = 'buttons/' + code_or_custom;
  this.client._getHttp(path, null, function onGet(err, obj) {
    if (!handleError(err, obj, 'button', callback)) {
      var button = new Button(self.client, obj.button, self);
      callback(null, button);
    }
  });
};

//## createButton
// returns a new `Button` associated with this account.
//
//```
//var args = {
//             "name"               : "test",
//             "type"               : "buy_now",
//             "subscription"       : false,
//             "price_string"       : "1.23",
//             "price_currency_iso" : "USD",
//             "custom"             : "Order123",
//             "callback_url"       : "http://www.example.com/my_custom_button_callback",
//             "description"        : "Sample description",
//             "style"              : "custom_large",
//             "include_email"      : true
//};
//myAccount.createButton(args, function(err, button) {
//  // do something with the button
//});
//```
//
// [See Coinbase create-a-new-payment-button-page-or-iframe API Documentation](https://developers.coinbase.com/api#create-a-new-payment-button-page-or-iframe)
// - - -
Account.prototype.createButton = function(args, callback) {
  var self = this;
  var body = {
    "account_id": this.id,
    "button": args
  };
  this.client._postHttp('buttons', body,
    function onPost(err, obj) {
      if (!handleError(err, obj, 'button', callback)) {
        var button = new Button(self.client, obj.button, self);
        callback(null, button);
      }
  });
};

//## getOrders
// returns an array of Order object instances associated with this `Account`.
//
//```
//myAccount.getOrders(1, 10, function(err, orders) {
//  // process array of orders
//});
//```
// _args `page` and `limit` optional but recommended.  If you request
// page 1 of size 10 and get an array of size 10, you should request page
// 2 next.  If page 2 returns 3 items or any count smaller than `limit`, you
// have all the `Orders`_
//
// [See Coinbase list-orders API Documentation](https://developers.coinbase.com/api#list-orders)
// - - -
Account.prototype.getOrders = function(page, limit, callback) {

  var opts = {
    'colName'  : 'orders',
    'typeName' : 'order',
    'ObjFunc'  : Order,
    'page'     : page,
    'limit'    : limit
  };

  this._getAll(opts, callback);
};

//## getOrder
// returns an Order object instance associated with this `Account`.
//
//```
//myAccount.getOrder('O1234', function(err, order) {
//  // process order
//});
//```
// _arg order_id is required_
// [See Coinbase show-an-order API Documentation](https://developers.coinbase.com/api#show-an-order)
// - - -
Account.prototype.getOrder = function(order_id, callback) {

  var opts = {
    'colName'  : 'orders',
    'typeName' : 'order',
    'ObjFunc'  : Order,
    'id'       : order_id
  };

  this._getOne(opts, callback);
};

//## createOrder
// returns a new Order object instance associated with this `Account`.
//
//```
//var args = {
//             "name"               : "test",
//             "type"               : "buy_now",
//             "price_string"       : "1.23",
//             "price_currency_iso" : "USD"
//};
//myAccount.createOrder(args, function(err, order) {
//  // process order
//});
//```
//
// [See Coinbase create-an-order API Documentation](https://developers.coinbase.com/api#create-an-order)
// - - -
Account.prototype.createOrder = function(args, callback) {
  var self = this;
  var body = {
    "account_id" : this.id,
    "button"     : args
  };
  this.client._postHttp('orders', body,
    function onPost(err, obj) {
      if (!handleError(err, obj, 'order', callback)) {
        var order = new Order(self, obj.order);
        callback(null, order);
      }
  });
};

//## buy
// returns a `Transfer` object associated with this purchase.
//
//```
//var args = {
//            "qty": 10
//};
//myAccount.buy(args, function(err, xfer) {
//  // process xfer
//});
//```
//
// [See Coinbase buys API Documentation](https://developers.coinbase.com/api#buys)
// - - -
Account.prototype.buy = function(args, callback) {
  this._trade('buys', args, callback);
};

//## sell
// returns a `Transfer` object associated with this sale.
//
//```
//var args = {
//            "qty": 10
//};
//myAccount.sell(args, function(err, xfer) {
//  // process xfer
//});
//```
//
// [See Coinbase sells API Documentation](https://developers.coinbase.com/api#sells)
// - - -
Account.prototype.sell = function(args, callback) {
  this._trade('sells', args, callback);
};

module.exports = Account;

