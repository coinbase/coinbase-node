"use strict";
var BaseModel   = require('./BaseModel'),
    handleError = require('../errorHandler').handleError;

function User(client, data) {
  if (!(this instanceof User)) {
    return new User(client, data);
  }
  BaseModel.call(this, client, data);
}

User.prototype = Object.create(BaseModel.prototype);

User.prototype.update = function(args, callback) {
  var self = this;
  if (!self.client) {throw "no client";}
  if (!self.id) {
    callback(new Error("no user id"), null);
    return;
  }

  var path = 'user';

  self.client._putHttp(path, args, function onPut(err, result) {
    if (!handleError(err, result, callback)) {
      callback(null, new User(self.client, result.data));
    }
  });
};

User.prototype.showAuth = function(callback) {
  var self = this;
  if (!self.client) {throw "no client";}
  if (!self.id) {
    callback(new Error("no user id"), null);
    return;
  }

  var path = 'user/auth';

  self.client._getHttp(path, null, function onGet(err, result) {
    if (!handleError(err, result, callback)) {
      callback(null, result.data);
    }
  });
};

module.exports = User;
