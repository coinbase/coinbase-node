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

Transaction.prototype.resend = function(callback) {
  var self = this;
  if (self.type !== 'request') {
    throw "Can only resend 'request' transactions";
  }

  var path = 'accounts/' + self.account.id +  '/transactions/' + self.id + '/resend';

  return this._createPromise(function (resolve, reject) {
    self.client._postHttp(path, null, function onPut(err, result) {
      if (!handleError(err, result, reject)) {
        resolve([result]);
      }
    });
  }, callback);
};

Transaction.prototype.complete = function(callback) {
  var self = this;
  if (self.type !== 'request') {
    throw "Can only complete 'request' transactions";
  }

  var path = 'accounts/' + self.account.id +  '/transactions/' + self.id + '/complete';

  return this._createPromise(function (resolve, reject) {
    self.client._postHttp(path, null, function onPut(err, result) {
      if (!handleError(err, result, reject)) {
        resolve([new Transaction(self.client, result.data, self.account)]);
      }
    });
  }, callback);
};

Transaction.prototype.cancel = function(callback) {
  var self = this;
  if (self.type !== 'request') {
    throw "Can only cancel 'request' transactions";
  }

  var path = 'accounts/' + self.account.id +  '/transactions/' + self.id;

  return this._createPromise(function (resolve, reject) {
    self.client._deleteHttp(path, function onDel(err, result) {
      if (!handleError(err, result, reject)) {
        resolve([result]);
      }
    });
  }, callback);
};

module.exports = Transaction;

