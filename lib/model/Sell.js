"use strict";
var Transfer    = require('./Transfer'),
    handleError = require('../errorHandler').handleError;

//##CONSTRUCTOR
//
// _args `client`, `data`, and `account` required_
//
//```
// var Sell = require('coinbase').model.Sell;
// var mySell = new Sell(client, data, account);
//```
// - - -
function Sell(client, data, account) {
  if (!(this instanceof Sell)) {
    return new Sell(client, data, account);
  }
  Transfer.call(this, client, data, account);
}

Sell.prototype = Object.create(Transfer.prototype);

Sell.prototype.commit = function(callback) {

  var opts = {
    'colName' : 'sells',
    'ObjFunc' : Sell
  };

  this._commit(opts, callback);
};

module.exports = Sell;
