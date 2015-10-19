"use strict";
var BaseModel   = require('./BaseModel'),
    handleError = require('../errorHandler').handleError;

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

Transfer.prototype._commit = function(opts, callback) {
  var self = this;

  var path = 'accounts/' + self.account.id + '/' + opts.colName + '/' + self.id + '/commit';

  self.client._postHttp(path, null, function onPut(err, result) {
    if (!handleError(err, result, callback)) {
      callback(null, new opts.ObjFunc(self.client, result.data, self.account));
    }
  });
};

module.exports = Transfer;

