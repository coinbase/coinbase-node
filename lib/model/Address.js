"use strict";
var BaseModel   = require('./BaseModel'),
    Transaction = require('./Transaction'),
    handleError = require('../errorHandler').handleError,
    _           = require('lodash');

//##CONSTRUCTOR
//
// _args `client`, `data`, and `account` required_
//
//```
// var Address = require('coinbase').model.Address;
// var myAddress = new Address(client, data, account);
//```
// _normally you will get address from `Address` methods on the Account
// or methods on existing instance of `Address`_
// - - -

function Address(client, data, account) {
  if (!(this instanceof Address)) {
    return new Address(client, data, account);
  }
  BaseModel.call(this, client, data);
  if (!account) { throw new Error("no account arg"); }
  if (!account.id) { throw new Error("account has no id"); }
  this.account = account;
}

Address.prototype = Object.create(BaseModel.prototype);

Address.prototype.getTransactions = function(args, callback) {
  var opts = {
    'colName'  : 'addresses/' + this.id + '/transactions',
    'ObjFunc'  : Transaction,
  };

  this.account._getAll(_.assign(args || {}, opts), callback)
};

module.exports = Address;
