"use strict";
var BaseModel   = require('./BaseModel'),
    Order       = require('./Order'),
    handleError = require('../errorHandler').handleError,
    _           = require('lodash');

// ##CONSTRUCTOR
//
// _args `client`, `data`, and `account` required_
//
//```
// var Button = require('coinbase').model.Button;
// var myButton = new Button(client, data, account);
//```
// _normally you will get buttons from `Button` methods on the Account_
// - - -
function Button(client, data, account) {
  if (!(this instanceof Button)) {
    return new Button(client, data, account);
  }
  BaseModel.call(this, client, data);
  if (!account) { throw new Error("no account arg"); }
  if (!account.id) { throw new Error("account has no id"); }
  this.account = account;
}

Button.prototype = Object.create(BaseModel.prototype);

//## getOrders
// returns an array of Order object instances associated with this button.
//
//```
//myButton.getOrders(1, 10, function(err, orders) {
//  // process array of orders
//});
//```
// _args `page` and `limit` optional but recommended.  If you request
// page 1 of size 10 and get an array of size 10, you should request page
// 2 next.  If page 2 returns 3 items or any count smaller than `limit`, you
// have all the `Orders`_
//
// [See Coinbase list-orders-for-a-button API Documentation](https://developers.coinbase.com/api#list-orders-for-a-button)
// - - -
Button.prototype.getOrders = function(page, limit, callback) {
  var self = this;
  if (!self.account) {throw "no account";}
  var path = 'buttons/' + self.code + '/orders';
  var params = {'account_id': this.account.id};
  if (page) {params.page = page;}
  if (limit) {params.limit = limit;}

  var cb = function(err, result) {
    if (!handleError(err, result, 'orders', callback)) {
      var orders = _.map(result.orders, function onMap(obj) {
        return new Button(self.client, obj.order, self.account);
      });
      callback(null, orders);
    }
  };

  self.client._getHttp(path, params, cb);
};

//## createOrder
// returns a new Order object instance associated with this button.
//
//```
//myButton.createOrder(function(err, order) {
//  // process order
//});
//```
//
// [See Coinbase create-an-order-for-a-button API Documentation](https://developers.coinbase.com/api#create-an-order-for-a-button)
// - - -
Button.prototype.createOrder = function(callback) {
  var self = this;
  if (!self.account) {throw "no account";}
  var path = 'buttons/' + self.code + '/create_order';

  self.client._postHttp(path, null, function onPost(err, result) {
    if (!handleError(err, result, 'order', callback)) {
      var order = new Order(self.client, result.order);
      callback(null, order);
    }
  });
};

module.exports = Button;

