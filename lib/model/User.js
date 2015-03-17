"use strict";
var BaseModel   = require('./BaseModel'),
    handleError = require('../errorHandler').handleError;

//##CONSTRUCTOR
//
// _args `client` and `data` are required_
//
//```
// var User = require('coinbase').model.User;
// var myUser = new User(client, data);
//```
// _normally you will get users from `User` methods on the `Client`._
// - - -
function User(client, data) {
  if (!(this instanceof User)) {
    return new User(client, data);
  }
  BaseModel.call(this, client, data);
}

User.prototype = Object.create(BaseModel.prototype);

//## modify
// change the native_currency of this user.
//
// returns a new updated `User` instance
//
//```
//var args = {"native_currency": "CAD"};
//myUser.modify(args, function(err, user) {
//  // do something with the modified user
//});
//```
//
// [See Coinbase modify-current-user API Documentation](https://developers.coinbase.com/api#modify-current-user)
// - - -
User.prototype.modify = function(args, callback) {
  var self = this;
  if (!self.client) {throw "no client";}
  if (!self.id) {
    callback(new Error("no user id"), null);
    return;
  }

  var path = 'users/' + self.id;

  self.client._putHttp(path, {'user': args}, function onPut(err, result) {
    if (!handleError(err, result, 'user', callback)) {
      callback(null, new User(self.client, result.user));
    }
  });
};

module.exports = User;

