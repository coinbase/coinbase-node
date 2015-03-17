"use strict";
var BaseModel   = require('./BaseModel'),
    handleError = require('../errorHandler').handleError;

// ##CONSTRUCTOR
//
// _args `client` and `data` required_
//
//```
// var Order = require('coinbase').model.Order;
// var button = new Order(client, data);
//```
// _normally you will get buttons from `Order` methods on the `Account` or on a `Button`_
// - - -
function Order(client, data) {
  if (!(this instanceof Order)) {
    return new Order(client, data);
  }
  BaseModel.call(this, client, data);
}

Order.prototype = Object.create(BaseModel.prototype);

//## refund
//returns an `Order` reflecting the refund status
//
//```
//var args = {
//             "refund_iso_code": "BTC"
//           };
//order.refund(args, function(err, uorder) {
//  //do something with the updated order
//});
//```
// [See Coinbase refund-an-order API Documentation](https://developers.coinbase.com/api#refund-an-order)
// - - -
Order.prototype.refund = function(args, callback) {
  var self = this;
  if (!self.client) {throw "no client";}
  if (!self.id) {
    callback(new Error("no order id"), null);
    return;
  }

  var path = 'orders/' + self.id + '/refund';

  self.client._postHttp(path, args, function onPost(err, result) {
    if (!handleError(err, result, 'order', callback)) {
      var order = new Order(self.client, result.order);
      callback(null, order);
    }
  });
};

module.exports = Order;

