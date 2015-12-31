"use strict";
var BaseModel   = require('./BaseModel'),
    Order       = require('./Order'),
    handleError = require('../errorHandler').handleError,
    _           = require('lodash');

// ##CONSTRUCTOR
//
// _args `client` and `data` required_
//
//```
// var Checkout = require('coinbase').model.Checkout;
// var myCheckout = new Checkout(client, data);
//```
function Checkout(client, data) {
  if (!(this instanceof Checkout)) {
    return new Checkout(client, data);
  }
  BaseModel.call(this, client, data);
}

Checkout.prototype = Object.create(BaseModel.prototype);

Checkout.prototype.getOrders = function(args, callback) {

  var opts = {
    'colName'  : 'checkouts/' + this.id + '/orders',
    'ObjFunc'  : Order
  };

  this.client._getAllHttp(_.assign(args || {}, opts), callback)
};

Checkout.prototype.createOrder = function(callback) {

  var opts = {
    'colName'  : 'checkouts/' + this.id + '/orders',
    'ObjFunc' : Order,
  };

  this.client._postOneHttp(opts, callback);
};

module.exports = Checkout;

