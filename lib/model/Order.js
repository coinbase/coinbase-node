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
function Order(client, data) {
  if (!(this instanceof Order)) {
    return new Order(client, data);
  }
  BaseModel.call(this, client, data);
}

Order.prototype = Object.create(BaseModel.prototype);

//```
// args = {
//   'currency'        : currency,
//   'mispayment'      : mispayment,
//   'refund_address'  : refund_address,
// };
Order.prototype.refund = function(args, callback) {
  var self = this;
  if (!self.client) {throw "no client";}
  if (!self.id) {
    callback(new Error("no order id"), null);
    return;
  }

  var path = 'orders/' + self.id + '/refund';

  self.client._postHttp(path, args, function onPost(err, result) {
    if (!handleError(err, result, callback)) {
      var order = new Order(self.client, result.data);
      callback(null, order);
    }
  });
};

module.exports = Order;

