"use strict";
var BaseModel   = require('./BaseModel'),
    handleError = require('../errorHandler').handleError;

//##CONSTRUCTOR
//
// _args `client`, `data`, and `account` required_
//
//```
// var Transfer = require('coinbase').model.Transfer;
// var myXfer = new Transfer(client, data, account);
//```
// _normally you will get transfers from `Transfer` methods on the Account
// or Order or Buy methods on other objects._
// - - -
function Transfer(client, data, account) {
  if (!(this instanceof Transfer)) {
    return new Transfer(client, data, account);
  }
  BaseModel.call(this, client, data);
  if (!account) { throw new Error("no account arg"); }
  if (!account.id) { throw new Error("account has no id"); }
  this.account = account;
}

Transfer.prototype = Object.create(BaseModel.prototype);

//## commit
// returns a `Transfer` reflecting the `commit` status
//
//```
//myXfer.commit(function(err, xfer) {
//    //do something with the committed xfer
//});
//```
//
// [See Coinbase complete-bitcoin-request API Documentation](https://developers.coinbase.com/api#complete-bitcoin-request)
// - - -
// [See Coinbase start-a-transfer-that-is-in-the-created-state API Documentation](https://developers.coinbase.com/api#start-a-transfer-that-is-in-the-created-state)
// - - -
Transfer.prototype.commit = function(callback) {
  var self = this;
  if (!self.client) {throw "no client";}
  if (!self.id) {
    callback(new Error("no xfer id"), null);
    return;
  }
  if (!self.account.id) {
    callback(new Error("no account id"), null);
    return;
  }

  var args = {
    'id': self.id,
    'account_id': self.account.id
  };

  var path = 'transfers/' + self.id + '/commit';

  self.client._postHttp(path, args, function onPut(err, result) {
    if (!handleError(err, result, 'transfer', callback)) {
      callback(null, new Transfer(self.client, result.transfer, self.account));
    }
  });
};

module.exports = Transfer;

