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

/**
 * Create a new deposit.
 * @param {Object} opts 
 * @param {Number} opts.amount              Deposit amount. ex 0.213    
 * @param {String} opts.currency            Currency for the amount. ex: 'USD'
 * @param {String} opts.paymentMethod       The ID of the payment method that should be used for the deposit. Payment methods can be listed using the client.getPaymentMethods(opts, cb) call
 * @param {Boolean} opts.commit             If set to false, this deposit will not be immediately completed. Use the commit call to complete it. Default value: true
 * @param {Function} callback 
 */
Deposit.prototype.createDeposit = function(opts, callback) {
  const path = 'accounts/' + this.account.id + '/deposits';
  const requestBody = {
    amount: opts.amount.toString(),
    currency: opts.currency,
    'payment_method': opts.paymentMethod,
    commit: typeof opts.commit === 'undefined' ? true : opts.commit
  }
  this.client._postHttp(path, requestBody, (err, result) => {
    if (!handleError(err, result, callback)) {
      callback(null, result.data);
    }
  });
}

Deposit.prototype.commit = function(callback) {

  var opts = {
    'colName' : 'deposits',
    'ObjFunc' : Deposit
  };

  this._commit(opts, callback);
};

module.exports = Deposit;
