"use strict";
var BaseModel   = require('./BaseModel'),
    handleError = require('../errorHandler').handleError;

// ##CONSTRUCTOR
//
// _args `client` and `data` required_
//
//```
// var Subscription = require('coinbase').model.Subscription;
// var button = new Subscription(client, data);
//```
// _normally you will get buttons from `Subscription` methods on the `Account` or on a `Button`_
// - - -
function Subscription(client, data) {
  if (!(this instanceof Subscription)) {
    return new Subscription(client, data);
  }
  BaseModel.call(this, client, data);
}

Subscription.prototype = Object.create(BaseModel.prototype);

//## cancel
//returns an `Subscription` reflecting the subscription status
//
//```
//var args = {
//           };
//subscription.cancel(args, function(err, res) {
//  //do something with the updated subscription
//});
//```
// [See Coinbase API Documentation](https://developers.coinbase.com/api#)
// - - -
/*
Subscription.prototype.cancel = function(args, callback) {
  var self = this;
  if (!self.client) {throw "no client";}
  if (!self.id) {
    callback(new Error("no subscription id"), null);
    return;
  }

  var path = 'subscribers/' + self.id + '/cancel';

  self.client._postHttp(path, args, function onPost(err, result) {
    if (!handleError(err, result, 'subscription', callback)) {
      var subscription = new Subscription(self.client, result.recurring_payment);
      callback(null, subscription);
    }
  });
};
*/

module.exports = Subscription;

