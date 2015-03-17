"use strict";
var BaseModel   = require('./BaseModel'),
    handleError = require('../errorHandler').handleError;

//##CONSTRUCTOR
//
// _args `client`, `data`, and `account` required_
//
//```
// var Transaction = require('coinbase').model.Transaction;
// var myTxn = new Transaction(client, data, account);
//```
// _normally you will get transactions from `Transaction` methods on the Account
// or methods on existing instance of `Transaction`_
// - - -
function Transaction(client, data, account) {
  if (!(this instanceof Transaction)) {
    return new Transaction(client, data, account);
  }
  BaseModel.call(this, client, data);
  if (!account) { throw new Error("no account arg"); }
  if (!account.id) { throw new Error("account has no id"); }
  this.account = account;
}

Transaction.prototype = Object.create(BaseModel.prototype);

//## resend
// returns an `err` if resend fails
//
//```
//myTxn.resend(function(err, result) {
//  if (err) {
//    //notify someone resend failed
//  };
//});
//```
//
// [See Coinbase create-an-order-for-a-button API Documentation](https://developers.coinbase.com/api#create-an-order-for-a-button)
// - - -
// [See Coinbase resend-bitcoin-request API Documentation](https://developers.coinbase.com/api#resend-bitcoin-request)
// - - -
Transaction.prototype.resend = function(callback) {
  var self = this;
  if (!self.client) {throw "no client";}
  if (!self.id) {
    callback(new Error("no txn id"), null);
    return;
  }
  if (!self.account.id) {
    callback(new Error("no account id"), null);
    return;
  }

  var args = {
    'id': self.id,
    'account_id': self.account.id
  };

  var path = 'transactions/' + self.id + '/resend_request';

  self.client._putHttp(path, args, function onPut(err, result) {
    if (!handleError(err, result, null, callback)) {
      callback(null, result);
    }
  });

};

//## complete
// returns a `Transaction` reflecting `complete` status
//
//```
//myTxn.complete(function(err, txn) {
//    //do something with the completed txn
//});
//```
//
// [See Coinbase complete-bitcoin-request API Documentation](https://developers.coinbase.com/api#complete-bitcoin-request)
// - - -
Transaction.prototype.complete = function(callback) {
  var self = this;
  if (!self.client) {throw "no client";}
  if (!self.id) {
    callback(new Error("no txn id"), null);
    return;
  }
  if (!self.account.id) {
    callback(new Error("no account id"), null);
    return;
  }

  var args = {
    'id': self.id,
    'account_id': self.account.id
  };

  var path = 'transactions/' + self.id + '/complete_request';

  self.client._putHttp(path, args, function onPut(err, result) {
    if (!handleError(err, result, 'transaction', callback)) {
      callback(null, new Transaction(self.client,
          result.transaction, self.account));
    }
  });

};

//## cancel
// returns a `Transaction` reflecting `cancel` status
//
//```
//myTxn.cancel(function(err, txn) {
//    //do something with the cancelled txn
//});
//```
//
// [See Coinbase cancel-bitcoin-request API Documentation](https://developers.coinbase.com/api#cancel-bitcoin-request)
// - - -
Transaction.prototype.cancel = function(callback) {
  var self = this;
  if (!self.client) {throw "no client";}
  if (!self.id) {
    callback(new Error("no txn id"), null);
    return;
  }
  if (!self.account.id) {
    callback(new Error("no account id"), null);
    return;
  }

  var args = {
    'id': self.id,
    'account_id': self.account.id
  };

  var path = 'transactions/' + self.id + '/cancel_request';

  self.client._putHttp(path, args, function onDel(err, result) {
    if (!handleError(err, result, null, callback)) {
      callback(null, result);
    }
  });

};

module.exports = Transaction;

