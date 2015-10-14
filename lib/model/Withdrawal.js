"use strict";
var Transfer    = require('./Transfer'),
    handleError = require('../errorHandler').handleError;

//##CONSTRUCTOR
//
// _args `client`, `data`, and `account` required_
//
//```
// var Withdrawal = require('coinbase').model.Withdrawal;
// var myWithdrawal = new Withdrawal(client, data, account);
//```
// - - -
function Withdrawal(client, data, account) {
  if (!(this instanceof Withdrawal)) {
    return new Withdrawal(client, data, account);
  }
  Transfer.call(this, client, data, account);
}

Withdrawal.prototype = Object.create(Transfer.prototype);

Withdrawal.prototype.commit = function(callback) {

  var opts = {
    'colName' : 'withdrawals',
    'ObjFunc' : Withdrawal
  };

  this._commit(opts, callback);
};

module.exports = Withdrawal;
