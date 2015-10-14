"use strict";
var Transfer    = require('./Transfer'),
    handleError = require('../errorHandler').handleError;

//##CONSTRUCTOR
//
// _args `client`, `data`, and `account` required_
//
//```
// var Deposit = require('coinbase').model.Deposit;
// var myDeposit = new Deposit(client, data, account);
//```
// - - -
function Deposit(client, data, account) {
  if (!(this instanceof Deposit)) {
    return new Deposit(client, data, account);
  }
  Transfer.call(this, client, data, account);
}

Deposit.prototype = Object.create(Transfer.prototype);

Deposit.prototype.commit = function(callback) {

  var opts = {
    'colName' : 'deposits',
    'ObjFunc' : Deposit
  };

  this._commit(opts, callback);
};

module.exports = Deposit;
