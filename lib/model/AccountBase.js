//
// The AccountBase object has helper methods for the Account API
//
"use strict";
var BaseModel   = require('./BaseModel'),
    handleError = require('../errorHandler').handleError,
    Transaction = require('./Transaction'),
    _           = require('lodash');


// Constructor
//
// You must instantiate an 'Account' with the 'new' operator.
// ```
// new Acccount(c,d)
// ```
// 'client' and 'data' arguments are requried.
//
function AccountBase(client, data) {
  if (!(this instanceof AccountBase)) {
    return new AccountBase(client, data);
  }
  BaseModel.call(this, client, data);
}

AccountBase.prototype = Object.create(BaseModel.prototype);

// INTERNAL API
//
// ```
// opts = {
//   'colName'  : colName,
// };
// ```
//
AccountBase.prototype._getAll = function(opts, callback, headers) {
  var self = this;
  var args = {};
  var path;
  if (this.hasField(opts, 'next_uri')) {
    path = opts.next_uri.replace('/v2/', '');
    args = null;
  } else {
    path = 'accounts/' + this.id + '/' + opts.colName;
    if (this.hasField(opts, 'starting_after')) {
      args.starting_after = opts.starting_after;
    }
    if (this.hasField(opts, 'ending_before')) {
      args.ending_before = opts.ending_before;
    }
    if (this.hasField(opts, 'limit')) {
      args.limit = opts.limit;
    }
    if (this.hasField(opts, 'order')) {
      args.order = opts.order;
    }
  }

  return this._createPromise(function (resolve, reject) {
    self.client._getHttp(path, args, function onGet(err, result) {
      if (!handleError(err, result, reject)) {
        if (result.data.length > 0) {
          var ObjFunc = self.client._stringToClass(result.data[0].resource);
        }
        var objs = _.map(result.data, function onMap(obj) {
          return new ObjFunc(self.client, obj, self);
        });
        resolve([objs, result.pagination])
      }
    }, headers);
  }, callback);
};

// INTERNAL API
//
// ```
// opts = {
//   'colName': colName,
//   'id': id
// };
// ```
//
AccountBase.prototype._getOne = function(opts, callback, headers) {
  var self = this;
  var path = 'accounts/' + this.id + '/' + opts.colName + '/' + opts.id;
  return this._createPromise(function (resolve, reject) {
    self.client._getHttp(path, null, function onGet(err, obj) {
      if (!handleError(err, obj, reject)) {
        var ObjFunc = self.client._stringToClass(obj.data.resource);
        resolve([new ObjFunc(self.client, obj.data, self)])
      }
    }, headers);
  }, callback);
};

// ```
// opts = {
//   'colName': colName,
//   'params' : params
// };
// ```
AccountBase.prototype._postOne = function(opts, callback, headers) {
  var self = this;
  var path = 'accounts/' + this.id + '/' + opts.colName;

  return this._createPromise(function (resolve, reject) {
    self.client._postHttp(path, opts.params, function onPost(err, obj) {
      if (!handleError(err, obj, reject)) {
        var ObjFunc = self.client._stringToClass(obj.data.resource);
        resolve([new ObjFunc(self.client, obj.data, self)]);
      }
    }, headers);
  }, callback);
};

// INTERNAL API
AccountBase.prototype._initTxn = function(args, callback, headers) {
  var self = this;
  var path = 'accounts/' + this.id + "/transactions";

  return this._createPromise(function (resolve, reject) {
    self.client._postHttp(path, args, function onPost(err, obj) {
      if (!handleError(err, obj, reject)) {
        var txn = new Transaction(self.client, obj.data, self);
        resolve([txn]);
      }
    }, headers);
  }, callback);
};

module.exports = AccountBase;
